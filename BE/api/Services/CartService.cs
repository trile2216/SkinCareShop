using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Cart;
using api.Constant;
using api.Interface;
using api.Models;
using Newtonsoft.Json;

namespace api.Services
{
    public class CartService : ICartService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;


        private const string CartSessionKey = "Cart";

        public CartService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

        }

        public List<CartItem> GetCartItems()
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            string? cartJson = session?.GetString(CartSessionKey);
            if (cartJson != null)
            {
                return JsonConvert.DeserializeObject<List<CartItem>>(cartJson); ;
            }
            return new List<CartItem>();
        }

        public void SetCart(List<CartItem> cartItems)
        {
            var session = _httpContextAccessor.HttpContext?.Session;
            string cartJson = JsonConvert.SerializeObject(cartItems);
            session?.SetString(CartSessionKey, cartJson);
        }

        public void AddCartItem(CartItem cartItem)
        {
            var cart = GetCartItems();
            var existingItem = cart.FirstOrDefault(item => item.ProductId == cartItem.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += cartItem.Quantity;
            }
            else
            {
                cart.Add(cartItem);
            }

            SetCart(cart);
        }

        public void DeleteCartItem(int productId)
        {
            var cart = GetCartItems();
            var item = cart.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                cart.Remove(item);
                SetCart(cart);
            }
        }

        public void ClearCart()
        {
            _httpContextAccessor.HttpContext?.Session.Remove(CartSessionKey);
        }

        public void UpdateQuantity(int productId, int quantity)
        {
            var cart = GetCartItems();
            var item = cart.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                if (quantity > 0)
                {
                    item.Quantity = quantity;
                }
                else
                {
                    cart.Remove(item);
                }

            }
            SetCart(cart);
        }
    }
}