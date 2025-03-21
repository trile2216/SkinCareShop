using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Interface;
using api.Mappers;
using api.DTOs.Blog;

namespace api.Controller
{
    [ApiController]
    [Route("api/blog")]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepository _blogRepo;

        public BlogController(IBlogRepository blogRepo)
        {
            _blogRepo = blogRepo;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _blogRepo.GetBlogsAsync();
            if (!blogs.Any())
                return NotFound("No blogs found");

            return Ok(blogs.Select(b => b.ToBlogDTO()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var blog = await _blogRepo.GetBlogByIdAsync(id);
            if (blog == null)
                return NotFound("Blog not found");

            return Ok(blog.ToBlogDTO());
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromBody] CreateBlogDTO blogCreateDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var blog = blogCreateDTO.ToBlogFromCreateDTO();
            await _blogRepo.CreateBlogAsync(blog);

            return CreatedAtAction(nameof(GetBlogById),
                                   new { id = blog.Id },
                                   blog.ToBlogDTO());
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] UpdateBlogDTO blogUpdateDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var blog = blogUpdateDTO.ToBlogFromUpdateDTO();
            var updatedBlog = await _blogRepo.UpdateBlogAsync(id, blog);

            if (updatedBlog == null)
                return NotFound("Blog not found");

            return Ok(updatedBlog.ToBlogDTO());
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var deleted = await _blogRepo.DeleteBlogAsync(id);
            if (deleted == null)
                return NotFound("Blog not found");

            return Ok("Blog deleted");
        }

        // Endpoint mới 1: Lấy danh sách Category
        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _blogRepo.GetAllCategoriesAsync();
            if (!categories.Any())
                return NotFound("No categories found");

            return Ok(categories);
        }

        // Endpoint mới 2: Lấy danh sách Skintype
        [HttpGet("skintypes")]
        public async Task<IActionResult> GetAllSkintypes()
        {
            var skintypes = await _blogRepo.GetAllSkintypesAsync();
            if (!skintypes.Any())
                return NotFound("No skintypes found");

            return Ok(skintypes);
        }
    }
}
