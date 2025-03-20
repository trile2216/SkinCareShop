using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using Microsoft.AspNetCore.Mvc;
using api.Mappers;
using api.DTOs;
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

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _blogRepo.GetBlogsAsync();

            if (!blogs.Any())
            {
                return NotFound("No blogs found");
            }
            return Ok(blogs.Select(b => b.ToBlogDTO()));
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var blog = await _blogRepo.GetBlogByIdAsync(id);

            if (blog == null)
            {
                return NotFound("Blog not found");
            }
            return Ok(blog.ToBlogDTO());
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateBlog([FromBody] CreateBlogDTO blogCreateDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var blog = blogCreateDTO.ToBlogFromCreateDTO();
            await _blogRepo.CreateBlogAsync(blog);

            return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog.ToBlogDTO());
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateBlog([FromRoute] int id, [FromBody] UpdateBlogDTO blogUpdateDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var blog = blogUpdateDTO.ToBlogFromUpdateDTO();
            var updatedBlog = await _blogRepo.UpdateBlogAsync(id, blog);

            if (updatedBlog == null)
            {
                return NotFound("Blog not found");
            }

            return Ok(updatedBlog.ToBlogDTO());
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteBlog([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            await _blogRepo.DeleteBlogAsync(id);

            return Ok("Blog deleted");
        }
    }
}