using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.Order;
using api.Enum;
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

        public OrderController(IOrderRepository orderRepo, IOrderItemRepository orderItemRepo)
        {
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
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
        [Route("{orderId:int}")]
        public async Task<IActionResult> UpdateOrderAsync([FromRoute] int orderId, [FromBody] int orderStatus)
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

            await _orderRepo.UpdateOrderStatusAsync(orderId, orderStatus);

            return NoContent();
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