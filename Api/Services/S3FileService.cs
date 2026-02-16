using domain.Types;
using Amazon.S3;

public class S3FileService : IFileService
{
    private readonly AmazonS3Client _s3Client;
    private readonly string _bucketName;
    private readonly string? _minioEndpoint;

    public S3FileService(IConfiguration configuration)
    {
        string S3Region = configuration["S3Region"] ?? throw new Exception("S3BucketName not found in configuration");
        string S3BucketName = configuration["S3BucketName"] ?? throw new Exception("S3BucketName not found in configuration");
        string S3AccessKey = configuration["S3AccessKey"] ?? throw new Exception("S3AccessKey not found in configuration");
        string S3SecretKey = configuration["S3SecretKey"] ?? throw new Exception("S3SecretKey not found in configuration");
        string? MinioEndpoint = configuration["MinioEndpoint"];

        _minioEndpoint = MinioEndpoint;

        AmazonS3Config s3Config;

        if (MinioEndpoint != null) {
            s3Config = new AmazonS3Config
            {
                ServiceURL = MinioEndpoint,
                ForcePathStyle = true,
                AuthenticationRegion = "us-east-1",
                UseHttp = true,
                UseAccelerateEndpoint = false,
            };
        } else {
            s3Config = new AmazonS3Config
            {
                RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(S3Region)
            };
        }

        _bucketName = S3BucketName;
        _s3Client = new AmazonS3Client(S3AccessKey, S3SecretKey, s3Config);
    }

    public async Task<OperationResult<string>> GetPresignedUrl(string fileName, string contentType)
    {
        Console.WriteLine("MinioEndpoint: " + _minioEndpoint);
        Console.WriteLine("Endpoint segun AWS: " + _s3Client.Config.ServiceURL);
        try
        {
            string presignedUrl = await Task.Run(()=> _s3Client.GetPreSignedURL(new Amazon.S3.Model.GetPreSignedUrlRequest
            {BucketName = _bucketName,
    Key = fileName,
    Expires = DateTime.UtcNow.AddMinutes(15),
    Verb = Amazon.S3.HttpVerb.PUT,
    Protocol = Amazon.S3.Protocol.HTTP 
            }));
            Console.WriteLine("Generated presigned URL: " + presignedUrl);

            return new OperationResult<string>(presignedUrl);
        }
        catch (Exception e)
        {
            return new OperationResult<string>(e);
        }
    }
}