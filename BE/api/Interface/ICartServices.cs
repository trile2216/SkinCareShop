using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interface
{
    public interface ICartServices
    {
        List<CartItem> GetCartItems();

        void SetCart(List<CartItem> cartItems);

        void AddCartItem(CartItem cartItem);

        void UpdateQuantity(int productId, int quantity);

        void DeleteCartItem(int productId);

        void ClearCart();

    }
}