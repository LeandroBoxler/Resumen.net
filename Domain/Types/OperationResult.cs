
namespace domain.Types;

public class OperationResult
{
    public bool IsSuccess { get; private set; }
    public Exception? Error { get; private set; }

    public OperationResult() { IsSuccess = true; Error = null; }
    public OperationResult(Exception error) { IsSuccess = false; Error = error; }
}
public class OperationResult<T>
{
    public T? Value { get; private set; }
    public bool IsSuccess { get; private set; }
    public Exception? Error { get; private set; }

    public OperationResult(T value) { Value = value; IsSuccess = true; Error = null; }
    public OperationResult(Exception error) { IsSuccess = false; Error = error; }
}