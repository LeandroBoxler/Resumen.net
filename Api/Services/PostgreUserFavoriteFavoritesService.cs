using domain.Entities;
using domain.services;
using domain.Types;
using Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Api.Services;

public class PostgreUserFavoriteFavoritesService : IService<UserFavorite>
{
    private readonly AppDbContext _ctx;
    public PostgreUserFavoriteFavoritesService(AppDbContext ctx)
    {
        _ctx = ctx;        
    }
    
    public async Task<OperationResult> Create(UserFavorite create)
    {
        try {
            await _ctx.UserFavorites.AddAsync(create);
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
        var entity = await _ctx.UserFavorites.FindAsync(id);
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

    public async Task<OperationResult<UserFavorite[]>> GetAll()
    {
        try {
        var items = await _ctx.UserFavorites.ToArrayAsync();
        
        return new OperationResult<UserFavorite[]>(items);

        }
        catch (Exception ex)
        {
            return new OperationResult<UserFavorite[]>(ex);
        }
    }

    public async Task<OperationResult<UserFavorite>> GetById(Guid id)
    {
        var item = await _ctx.UserFavorites.FindAsync(id);
            if (item == null) return new OperationResult<UserFavorite>(new Exception("Not found"));
            return new OperationResult<UserFavorite>(item);
    }

    public async Task<OperationResult> Update(UserFavorite update)
    {
        try
        {
            var existing = await _ctx.UserFavorites.FindAsync(update.Id);
            if (existing == null) return new OperationResult(new Exception("Not found"));
            _ctx.UserFavorites.Update(existing);
            await _ctx.SaveChangesAsync();
            return new OperationResult();
        } catch (Exception e)
        {
            return new OperationResult(e);
        }
    }

    public async Task<OperationResult<UserFavorite[]>> GetMany(Query<UserFavorite> query)
    {
        try
        {
            IQueryable<UserFavorite> users = _ctx.UserFavorites.AsQueryable();

            if (query.Filters != null)
            {
                users = ApplyFilter(users, query.Filters);
            }

            if (query.Offset.HasValue)
                users = users.Skip(query.Offset.Value);

            if (query.Limit.HasValue)
                users = users.Take(query.Limit.Value);

            var result = await users.ToArrayAsync();
            return new OperationResult<UserFavorite[]>(result);
        }
        catch (Exception ex)
        {
            return new OperationResult<UserFavorite[]>(ex);
        }
    }

    public async Task<OperationResult<UserFavorite>> GetOne(Query<UserFavorite> query)
    {
        try
        {
            IQueryable<UserFavorite> users = _ctx.UserFavorites.AsQueryable();

            if (query.Filters != null)
            {
                users = ApplyFilter(users, query.Filters);
            }

            var user = await users.FirstOrDefaultAsync();
            if (user == null)
                return new OperationResult<UserFavorite>(new Exception("Not found"));

            return new OperationResult<UserFavorite>(user);
        }
        catch (Exception ex)
        {
            return new OperationResult<UserFavorite>(ex);
        }
    }

    //  filtros 
    private IQueryable<UserFavorite> ApplyFilter(IQueryable<UserFavorite> query, IFilter<UserFavorite> filter)
    {
        if (filter is BaseFilter<UserFavorite> baseFilter)
        {
            var param = Expression.Parameter(typeof(UserFavorite), "x");
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

            var lambda = Expression.Lambda<Func<UserFavorite, bool>>(body, param);
            return query.Where(lambda);
        }
        else if (filter is AndFilter<UserFavorite> andFilter)
        {
            foreach (var subFilter in andFilter.Value)
            {
                query = ApplyFilter(query, subFilter);
            }
            return query;
        }
        else if (filter is OrFilter<UserFavorite> orFilter)
        {
            var param = Expression.Parameter(typeof(UserFavorite), "x");
            Expression? body = null;

            foreach (var subFilter in orFilter.Value)
            {
                var subQuery = ApplyFilter(_ctx.UserFavorites.AsQueryable(), subFilter);
                var subExpr = ((Expression<Func<UserFavorite, bool>>)subQuery.Expression).Body;

                body = body == null ? subExpr : Expression.OrElse(body, subExpr);
            }

            if (body == null) return query;
            var lambda = Expression.Lambda<Func<UserFavorite, bool>>(body, param);
            return query.Where(lambda);
        }

        return query;
    }
}