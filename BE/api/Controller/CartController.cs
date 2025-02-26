using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Cart;
using api.Interface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/cart")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        private readonly IProductRepository _productRepo;

        public CartController(ICartService cartService, IProductRepository productRepo)
        {
            _cartService = cartService;
            _productRepo = productRepo;
        }


        [HttpGet]
        public IActionResult GetCartItems()
        {
            var cartItems = _cartService.GetCartItems();

            return Ok(_cartService.GetCartItems());
        }

        [HttpPost]
        [Route("add")]

        public async Task<IActionResult> AddCartItem([FromBody] CartItemDTO cartItemDTO)
        {
            var product = await _productRepo.GetProductByIdAsync(cartItemDTO.ProductId);

            if (product == null)
            {
                return NotFound();
            }

            var cartItem = product.ToCartItem();
            cartItem.Quantity = cartItemDTO.Quantity;

            _cartService.AddCartItem(cartItem);
            return Ok();
        }

        [HttpPost]
        [Route("update-quantity")]
        public IActionResult UpdateQuantity([FromBody] CartItemDTO cartItemDTO)
        {
            _cartService.UpdateQuantity(cartItemDTO.ProductId, cartItemDTO.Quantity);
            return Ok();
        }

        [HttpDelete]
        [Route("{productId:int}")]
        public IActionResult DeleteCartItem(int productId)
        {
            _cartService.DeleteCartItem(productId);
            return Ok();
        }
    }
}