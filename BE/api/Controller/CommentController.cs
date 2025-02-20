using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Comments;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;

        public CommentController(ICommentRepository commentRepo)
        {
            _commentRepo = commentRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments()
        {
            var comments = await _commentRepo.GetAllCommentsAsync();

            if (comments == null)
            {
                return NotFound();
            }

            var commentDTOs = comments.Select(c => c.ToCommentDTO());

            return Ok(commentDTOs);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetComment(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comment = await _commentRepo.GetCommentByIdAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            var commentDTO = comment.ToCommentDTO();

            return Ok(commentDTO);
        }

        [HttpGet]
        [Route("product/{productId:int}")]
        public async Task<IActionResult> GetCommentsByProductId(int productId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comments = await _commentRepo.GetCommentsByProductIdAsync(productId);

            if (comments == null)
            {
                return NotFound();
            }

            var commentDTOs = comments.Select(c => c.ToCommentDTO());

            return Ok(commentDTOs);
        }

        [HttpGet]
        [Route("customer/{customerId:int}")]
        public async Task<IActionResult> GetCommentsByCustomerId(int customerId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comments = await _commentRepo.GetCommentsByCustomerIdAsync(customerId);

            if (comments == null)
            {
                return NotFound();
            }

            var commentDTOs = comments.Select(c => c.ToCommentDTO());

            return Ok(commentDTOs);
        }

        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CreateCommentDTO commentDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var comment = commentDTO.ToCommentFromCreateDTO();

            var result = await _commentRepo.AddCommentAsync(comment);

            if (result == null)
            {
                return BadRequest();
            }

            return Ok(commentDTO);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentDTO updatecommentDTO, int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var comment = updatecommentDTO.ToCommentFromUpdateDTO();

            var result = await _commentRepo.UpdateCommentAsync(id, comment);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result.ToCommentDTO());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _commentRepo.DeleteComment(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result.ToCommentDTO());
        }
    }
}