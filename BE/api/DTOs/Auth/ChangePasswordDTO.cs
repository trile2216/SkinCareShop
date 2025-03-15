using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Auth
{
    public class ChangePasswordDTO
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword")]
        public string ComfirmPassword { get; set; }
    }
}