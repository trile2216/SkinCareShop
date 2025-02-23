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
    public class CartController : ControllerBase
    {
        private readonly ICartServices _cartServices;

        private readonly IProductRepository _productRepo;

        public CartController(ICartServices cartServices, IProductRepository productRepo)
        {
            _cartServices = cartServices;
            _productRepo = productRepo;
        }


        [HttpGet]
        public IActionResult GetCartItems()
        {
            var cartItems = _cartServices.GetCartItems();

            return Ok(_cartServices.GetCartItems());
        }

        [HttpPost]
        [Route("{productId:int}")]
        public async Task<IActionResult> AddCartItem([FromRoute] int productId)
        {
            var product = await _productRepo.GetProductByIdAsync(productId);

            if (product == null)
            {
                return NotFound();
            }

            var cartItemDTO = product.ToCartItemDTO();

            var cartItem = new CartItem
            {
                ProductId = productId,
                ItemDTO = cartItemDTO,
                Quantity = 1
            };

            _cartServices.AddCartItem(cartItem);
            return Ok();
        }

        [HttpPost]
        public IActionResult UpdateQuantity([FromBody] UpdateQuantityDTO updateQuantityDTO)
        {
            _cartServices.UpdateQuantity(updateQuantityDTO.ProductId, updateQuantityDTO.Quantity);
            return Ok();
        }

        [HttpDelete]
        [Route("{productId:int}")]
        public IActionResult DeleteCartItem(int productId)
        {
            _cartServices.DeleteCartItem(productId);
            return Ok();
        }
    }
}