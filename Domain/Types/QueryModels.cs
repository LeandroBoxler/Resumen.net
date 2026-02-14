using System.Linq.Expressions;

namespace domain.Types;

public enum FilterOperator {
    Eq,
    Neq,
    Gt,
    Gte,
    Lt,
    Lte,
    Contains,
    In
}

public interface IFilter<T> { }

public class BaseFilter<T> : IFilter<T>
{
    public string Field { get; set; } = default!;
    public FilterOperator Operator { get; set; }
    public object? Value { get; set; }
}

public class AndFilter<T> : IFilter<T>
    {
    public List<IFilter<T>> Value { get; set; } = new();
    }

public class OrFilter<T> : IFilter<T>
{
    public List<IFilter<T>> Value { get; set; } = new();
}

public class Query<T>
{
    public IFilter<T>? Filters { get; set; }
    public bool IncludeDeleted { get; set; } = false;
    public int? Limit { get; set; }
    public int? Offset { get; set; }
}