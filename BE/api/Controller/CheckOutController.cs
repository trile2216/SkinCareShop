using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.CheckOut;
using api.Enum;
using api.Interface;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckOutController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        private readonly ICartService _cartService;

        private readonly IOrderRepository _orderRepo;

        private readonly IOrderItemRepository _orderItemRepo;

        private readonly IProductRepository _productRepo;

        public CheckOutController(
            IVnPayService vnPayService,
            ICartService cartService,
            IOrderRepository orderRepo,
            IOrderItemRepository orderItemRepo,
            IProductRepository productRepo
            )
        {
            _vnPayService = vnPayService;
            _cartService = cartService;
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
            _productRepo = productRepo;
        }

        [HttpPost]
        [Route("processpayment")]
        [Authorize]
        public async Task<IActionResult> ProcessPayment([FromBody] CheckOutDTO checkOutDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var cartItems = _cartService.GetCartItems();
                if (cartItems.Count == 0)
                {
                    return BadRequest("Giỏ hàng trống");
                }

                switch (checkOutDTO.PaymentMethod)
                {
                    case PaymentMethod.BankTransfer:
                        var paymentInfo = new PaymentInformationModel
                        {
                            OrderType = "200000",
                            Amount = (double)checkOutDTO.TotalPrice,
                            OrderDescription = $"Thanh toan don hang #{DateTime.Now.Ticks}",
                            Name = checkOutDTO.CustomerId.ToString()
                        };
                        var url = _vnPayService.CreatePaymentUrl(paymentInfo, HttpContext);
                        return Ok(new { paymentUrl = url });

                    case PaymentMethod.COD:
                        var order = new Order
                        {
                            CustomerId = checkOutDTO.CustomerId,
                            OrderDate = DateTime.Now,
                            Status = OrderStatus.Pending,
                            TotalPrice = checkOutDTO.TotalPrice
                        };

                        var createdOrder = await _orderRepo.CreateOrderAsync(order);

                        foreach (var item in checkOutDTO.CartItems)
                        {
                            var orderItem = new OrderItem
                            {
                                OrderId = createdOrder.Id,
                                ProductId = item.ProductId,
                                Quantity = item.Quantity,
                                UnitPrice = item.ProductPrice
                            };
                            await _orderItemRepo.CreateOrderItemAsync(orderItem);
                            await _productRepo.UpdateProductQuantityAsync(item.ProductId, item.Quantity);
                        }

                        _cartService.ClearCart();

                        return Ok(new
                        {
                            Success = true,
                            Message = "Đặt hàng COD thành công",
                            OrderId = createdOrder.Id
                        });

                    default:
                        return BadRequest("Phương thức thanh toán không hợp lệ");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi xử lý thanh toán", Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("paymentcallback")]
        [Authorize]
        public async Task<IActionResult> PaymentCallback()
        {
            var responseCode = Request.Query["vnp_ResponseCode"].ToString();
            if (responseCode == "00")
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                if (response.Success)
                {
                    try
                    {
                        var orderInfo = Request.Query["vnp_OrderInfo"].ToString().Split(' ');
                        var customerId = int.Parse(orderInfo[0]);

                        var order = new Order
                        {
                            CustomerId = customerId,
                            OrderDate = DateTime.Now,
                            Status = OrderStatus.Pending,
                            TotalPrice = decimal.Parse(orderInfo[orderInfo.Length - 1])
                        };

                        var createdOrder = await _orderRepo.CreateOrderAsync(order);

                        var cartItems = _cartService.GetCartItems();
                        foreach (var item in cartItems)
                        {
                            var orderItem = new OrderItem
                            {
                                OrderId = createdOrder.Id,
                                ProductId = item.ProductId,
                                Quantity = item.Quantity,
                                UnitPrice = item.ProductPrice
                            };
                            await _orderItemRepo.CreateOrderItemAsync(orderItem);
                            await _productRepo.UpdateProductQuantityAsync(item.ProductId, item.Quantity);
                        }

                        _cartService.ClearCart();

                        return Ok(new
                        {
                            Success = true,
                            Message = "Thanh toán thành công",
                            OrderId = order.Id
                        });
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(new { Success = false, Message = ex.Message });
                    }
                }
            }
            else
            {
                string errorMess = "";
                switch (responseCode)
                {
                    case "11":
                        errorMess = "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.";
                        break;
                    case "12":
                        errorMess = "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.";
                        break;
                    case "51":
                        errorMess = "	Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.";
                        break;
                    case "14":
                        errorMess = "Request is invalid, mostly due to missing required fields";
                        break;
                    case "24":
                        errorMess = "Giao dịch không thành công do: Khách hàng hủy giao dịch";
                        break;
                    default:
                        errorMess = "Giao dịch không thành công do: Lỗi không xác định";
                        break;
                }
                return BadRequest(new
                {
                    Success = false,
                    Message = errorMess
                });
            }


            return BadRequest(new
            {
                Success = false,
                Message = "Thanh toán thất bại"
            });
        }
    }


}
