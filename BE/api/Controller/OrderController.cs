using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Order;
using api.Constant;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/order")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepo;

        private readonly IOrderItemRepository _orderItemRepo;

        private readonly IProductRepository _productRepo;

        public OrderController(IOrderRepository orderRepo, IOrderItemRepository orderItemRepo, IProductRepository productRepo)
        {
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
            _productRepo = productRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrdersAsync()
        {
            var orders = await _orderRepo.GetOrdersAsync();
            if (!orders.Any())
            {
                return NotFound("No orders found");
            }

            return Ok(orders.Select(o => o.ToOrderDTO()));
        }

        [HttpGet]
        [Route("{orderId:int}")]
        public async Task<IActionResult> GetOrderByIdAsync([FromRoute] int orderId)
        {
            var order = await _orderRepo.GetOrderByIdAsync(orderId);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order.ToOrderDTO());
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrderAsync([FromBody] CreateOrderDTO createOrderDTOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var order = createOrderDTOrder.ToOrderFromCreateDTO();
            await _orderRepo.CreateOrderAsync(order);

            foreach (var orderItem in createOrderDTOrder.OrderItems)
            {
                await _orderItemRepo.CreateOrderItemAsync(orderItem.ToOrderItemFromCreateDTO(order.Id));
            }

            return CreatedAtAction(nameof(GetOrderByIdAsync), new { orderId = order.Id }, order);
        }

        [HttpPut]
        [Route("{orderId:int}&{orderStatus:int}")]
        public async Task<IActionResult> UpdateOrderAsync([FromRoute] int orderId, [FromRoute] int orderStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _orderRepo.GetOrderByIdAsync(orderId);

            if (order == null)
            {
                return NotFound();
            }

            if (orderStatus == OrderStatus.Cancelled.GetHashCode())
            {
                var orderItems = await _orderItemRepo.GetOrderItemsByOrderIdAsync(orderId);
                foreach (var orderItem in orderItems)
                {
                    foreach (var item in order.OrderItems)
                    {
                        var product = await _productRepo.GetProductByIdAsync(item.ProductId);
                        if (product != null)
                        {
                            product.Stock += item.Quantity;
                            await _productRepo.UpdateProductAsync(product.Id, product);
                        }
                    }
                }
            }

            await _orderRepo.UpdateOrderStatusAsync(orderId, orderStatus);

            return Ok(order.ToOrderDTO());
        }

        [HttpGet]
        [Route("customer/{customerId:int}")]
        public async Task<IActionResult> GetOrdersByCustomerIdAsync([FromRoute] int customerId)
        {
            var orders = await _orderRepo.GetOrderByCustomerIdAsync(customerId);

            if (orders.Count == 0)
            {
                return NotFound("No orders found");
            }

            var orderDTOs = orders.Select(o => o.ToOrderDTO());

            return Ok(orderDTOs);
        }
    }
}