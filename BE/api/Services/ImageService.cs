using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;

namespace api.Services
{
    public class ImageService : IImageService
    {
        private readonly IConfiguration _configuration;

        public ImageService(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public async Task<string> UploadImageAsync(IFormFile file)
        {
            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var bucketName = _configuration["Firebase:StorageBucket"];
                    var jsonKeyFilePath = _configuration["Firebase:JsonKeyFilePath"];

                    var credential = GoogleCredential.FromFile(jsonKeyFilePath);
                    var storageClient = await StorageClient.CreateAsync(credential);
                    var objectName = file.FileName;

                    var uploadOptions = new UploadObjectOptions
                    {
                        PredefinedAcl = PredefinedObjectAcl.PublicRead
                    };

                    var storageObject = await storageClient.UploadObjectAsync(bucketName, objectName, file.ContentType, stream,options: uploadOptions);


                    string imageUrl = $"https://storage.googleapis.com/{bucketName}/{objectName}";

                    return imageUrl;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error uploading image: {ex.Message}");
            }
        }
    }
}