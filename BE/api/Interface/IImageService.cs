using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Interface
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file);
    }
}