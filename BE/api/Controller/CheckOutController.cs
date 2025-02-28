using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.CheckOut;
using api.Enum;
using api.Interface;
using api.Models;
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

                foreach (var item in checkOutDTO.CartItems)
                {
                    var product = await _productRepo.GetProductByIdAsync(item.ProductId);
                    if (product == null)
                    {
                        return BadRequest("Sản phẩm không tồn tại");
                    }

                    if (product.Stock - item.Quantity < 0)
                    {
                        return BadRequest("Số lượng sản phẩm không đủ");
                    }
                }


                switch (checkOutDTO.PaymentMethod)
                {
                    case PaymentMethod.VNPay:
                        var paymentInfo = new PaymentInformationModel
                        {
                            OrderType = "200000",
                            Amount = (double)(checkOutDTO.TotalPrice + checkOutDTO.ShippingFee),
                            OrderDescription = $"Thanh toan don hang #{DateTime.Now.Ticks}|#{checkOutDTO.TotalPrice.ToString()}|#{checkOutDTO.ShippingFee.ToString()}",
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
                            TotalPrice = checkOutDTO.TotalPrice,
                            ShippingFee = checkOutDTO.ShippingFee
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
                            await _productRepo.UpdateProductQuantityAfterOrderAsync(item.ProductId, item.Quantity);
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
                        var orderInfo = Request.Query["vnp_OrderInfo"].ToString().Split('|');

                        var customerId = int.Parse(Request.Query["vnp_OrderInfo"].ToString().Split('#')[0]);
                        var totalPrice = decimal.Parse(orderInfo[1].Trim('#'));
                        var shippingFee = decimal.Parse(orderInfo[2].Trim('#'));

                        var order = new Order
                        {
                            CustomerId = customerId,
                            OrderDate = DateTime.Now,
                            Status = OrderStatus.Pending,
                            TotalPrice = totalPrice,
                            ShippingFee = shippingFee
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
                            await _productRepo.UpdateProductQuantityAfterOrderAsync(item.ProductId, item.Quantity);
                        }

                        _cartService.ClearCart();

                        return Ok(response);
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
