using domain.Entities;
using domain.services;
using domain.Types;
using Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Api.Services;

public class PostgreUsersService : IService<User>
{
    private readonly AppDbContext _ctx;
    public PostgreUsersService(AppDbContext ctx)
    {
        _ctx = ctx;        
    }
    
    public async Task<OperationResult> Create(User create)
    {
        try {
            await _ctx.Users.AddAsync(create);
            await _ctx.SaveChangesAsync();
            return new OperationResult();
        }
        catch (Exception ex)
        {
            return new OperationResult(ex);
        }
    }

    public async Task<OperationResult> Delete(Guid id)
    {
        try {
        var entity = await _ctx.Users.FindAsync(id);
            if (entity == null) return new OperationResult(new Exception("Not found"));
        _ctx.Remove(entity);
        await _ctx.SaveChangesAsync();
        
        return new OperationResult();
        }
        catch (Exception ex)
        {
            return new OperationResult(ex);
        }
    }

    public async Task<OperationResult<User[]>> GetAll()
    {
        try {
        var items = await _ctx.Users.ToArrayAsync();
        
        return new OperationResult<User[]>(items);

        }
        catch (Exception ex)
        {
            return new OperationResult<User[]>(ex);
        }
    }

    public async Task<OperationResult<User>> GetById(Guid id)
    {
        var item = await _ctx.Users.FindAsync(id);
            if (item == null) return new OperationResult<User>(new Exception("Not found"));
            return new OperationResult<User>(item);
    }

    public async Task<OperationResult> Update(User update)
    {
        try
        {
            var existing = await _ctx.Users.FindAsync(update.Id);
            if (existing == null) return new OperationResult(new Exception("Not found"));
            existing.FirstName = update.FirstName;
            existing.LastName = update.LastName;
            _ctx.Users.Update(existing);
            await _ctx.SaveChangesAsync();
            return new OperationResult();
        } catch (Exception e)
        {
            return new OperationResult(e);
        }
    }

    public async Task<OperationResult<User[]>> GetMany(Query<User> query)
    {
        try
        {
            IQueryable<User> users = _ctx.Users.AsQueryable();

            if (query.Filters != null)
            {
                users = ApplyFilter(users, query.Filters);
            }

            if (query.Offset.HasValue)
                users = users.Skip(query.Offset.Value);

            if (query.Limit.HasValue)
                users = users.Take(query.Limit.Value);

            var result = await users.ToArrayAsync();
            return new OperationResult<User[]>(result);
        }
        catch (Exception ex)
        {
            return new OperationResult<User[]>(ex);
        }
    }

    public async Task<OperationResult<User>> GetOne(Query<User> query)
    {
        try
        {
            IQueryable<User> users = _ctx.Users.AsQueryable();

            if (query.Filters != null)
            {
                users = ApplyFilter(users, query.Filters);
            }

            var user = await users.FirstOrDefaultAsync();
            if (user == null)
                return new OperationResult<User>(new Exception("Not found"));

            return new OperationResult<User>(user);
        }
        catch (Exception ex)
        {
            return new OperationResult<User>(ex);
        }
    }

    // Aplica los filtros recursivamente
    private IQueryable<User> ApplyFilter(IQueryable<User> query, IFilter<User> filter)
    {
        if (filter is BaseFilter<User> baseFilter)
        {
            var param = Expression.Parameter(typeof(User), "x");
            var member = Expression.PropertyOrField(param, baseFilter.Field);
            var constant = Expression.Constant(Convert.ChangeType(baseFilter.Value, member.Type));

            Expression body = baseFilter.Operator switch
            {
                FilterOperator.Eq => Expression.Equal(member, constant),
                FilterOperator.Neq => Expression.NotEqual(member, constant),
                FilterOperator.Gt => Expression.GreaterThan(member, constant),
                FilterOperator.Gte => Expression.GreaterThanOrEqual(member, constant),
                FilterOperator.Lt => Expression.LessThan(member, constant),
                FilterOperator.Lte => Expression.LessThanOrEqual(member, constant),
                FilterOperator.Contains => Expression.Call(member, typeof(string).GetMethod("Contains", new[] { typeof(string) })!, constant),
                FilterOperator.In => Expression.Call(Expression.Constant(baseFilter.Value), typeof(List<>).MakeGenericType(member.Type).GetMethod("Contains")!, member),
                _ => throw new NotImplementedException()
            };

            var lambda = Expression.Lambda<Func<User, bool>>(body, param);
            return query.Where(lambda);
        }
        else if (filter is AndFilter<User> andFilter)
        {
            foreach (var subFilter in andFilter.Value)
            {
                query = ApplyFilter(query, subFilter);
            }
            return query;
        }
        else if (filter is OrFilter<User> orFilter)
        {
            var param = Expression.Parameter(typeof(User), "x");
            Expression? body = null;

            foreach (var subFilter in orFilter.Value)
            {
                var subQuery = ApplyFilter(_ctx.Users.AsQueryable(), subFilter);
                var subExpr = ((Expression<Func<User, bool>>)subQuery.Expression).Body;

                body = body == null ? subExpr : Expression.OrElse(body, subExpr);
            }

            if (body == null) return query;
            var lambda = Expression.Lambda<Func<User, bool>>(body, param);
            return query.Where(lambda);
        }

        return query;
    }
}