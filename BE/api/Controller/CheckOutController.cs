using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.CheckOut;
using api.Constant;
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

        private readonly ICityRepository _cityRepository;

        private readonly IDistrictRepository _districtRepository;

        public CheckOutController(
            IVnPayService vnPayService,
            ICartService cartService,
            IOrderRepository orderRepo,
            IOrderItemRepository orderItemRepo,
            IProductRepository productRepo,
            ICityRepository cityRepository,
            IDistrictRepository districtRepository)
        {
            _vnPayService = vnPayService;
            _cartService = cartService;
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
            _productRepo = productRepo;
            _cityRepository = cityRepository;
            _districtRepository = districtRepository;
        }

        [HttpPost]
        [Route("process-payment")]
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
                var cityId = int.Parse(checkOutDTO.City);
                var districtId = int.Parse(checkOutDTO.State);

                var city = await _cityRepository.GetCityByIdAsync(cityId);
                if (city == null)
                {
                    return BadRequest("Thành phố không tồn tại");
                }

                var district = await _districtRepository.GetDistrictByIdAsync(districtId);

                if (district == null)
                {
                    return BadRequest("Quận huyện không tồn tại");
                }

                var deliveryAddress = $"{checkOutDTO.Street}, {district.Name}, {city.Name}";
                var order = new Order();
                switch (checkOutDTO.PaymentMethod)
                {

                    case PaymentMethod.VNPay:

                        order = await _orderRepo.CreateOrderAsync(new Order
                        {
                            CustomerId = checkOutDTO.CustomerId,
                            OrderDate = DateTime.Now,
                            Status = OrderStatus.Pending,
                            PaymentMethod = PaymentMethod.VNPay.ToString(),
                            TransactionId = "",
                            TotalPrice = checkOutDTO.TotalPrice,
                            ShippingFee = checkOutDTO.ShippingFee,
                            DeliveryAddress = deliveryAddress
                        });

                        foreach (var item in checkOutDTO.CartItems)
                        {
                            var orderItem = new OrderItem
                            {
                                OrderId = order.Id,
                                ProductId = item.ProductId,
                                Quantity = item.Quantity,
                                UnitPrice = item.ProductPrice
                            };
                            await _orderItemRepo.CreateOrderItemAsync(orderItem);
                            var product = await _productRepo.GetProductByIdAsync(item.ProductId);
                            if (product != null)
                            {
                                product.Stock -= item.Quantity;
                                await _productRepo.UpdateProductAsync(product.Id, product);
                            }
                        }



                        var paymentInfo = new PaymentInformationModel
                        {
                            OrderType = "200000",
                            Amount = (double)checkOutDTO.TotalPrice,
                            OrderDescription = $"Thanh toan don hang #{DateTime.Now.Ticks}#{order.Id}",
                            Name = checkOutDTO.CustomerId.ToString()
                        };

                        var url = _vnPayService.CreatePaymentUrl(paymentInfo, HttpContext);
                        return Ok(new { paymentUrl = url });

                    case PaymentMethod.COD:
                        order = await _orderRepo.CreateOrderAsync(new Order
                        {
                            CustomerId = checkOutDTO.CustomerId,
                            OrderDate = DateTime.Now,
                            Status = OrderStatus.Pending,
                            PaymentMethod = PaymentMethod.COD.ToString(),
                            TransactionId = "COD",
                            TotalPrice = checkOutDTO.TotalPrice,
                            ShippingFee = checkOutDTO.ShippingFee,
                            DeliveryAddress = deliveryAddress
                        });

                        foreach (var item in checkOutDTO.CartItems)
                        {
                            var orderItem = new OrderItem
                            {
                                OrderId = order.Id,
                                ProductId = item.ProductId,
                                Quantity = item.Quantity,
                                UnitPrice = item.ProductPrice
                            };
                            await _orderItemRepo.CreateOrderItemAsync(orderItem);
                            var product = await _productRepo.GetProductByIdAsync(item.ProductId);
                            if (product != null)
                            {
                                product.Stock -= item.Quantity;
                                await _productRepo.UpdateProductAsync(product.Id, product);
                            }
                        }

                        _cartService.ClearCart();

                        return Ok(new
                        {
                            Success = true,
                            Message = "Đặt hàng COD thành công",
                            OrderId = order.Id
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
        [Route("payment-callback")]
        public async Task<IActionResult> PaymentCallback()
        {
            try
            {
                var responseCode = Request.Query["vnp_ResponseCode"].ToString();
                var orderDescription = Request.Query["vnp_OrderInfo"].ToString().Split("|")[1];
                var descriptionPart = orderDescription.Split("#");
                var orderId = int.Parse(descriptionPart[descriptionPart.Length - 1]);
                var order = await _orderRepo.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return BadRequest(new { Success = false, Message = "Đơn hàng không tồn tại" });
                }

                if (responseCode == "00")
                {
                    var response = _vnPayService.PaymentExecute(Request.Query);

                    if (response.Success)
                    {
                        order.Status = OrderStatus.Comfirmed;
                        await _orderRepo.UpdateOrderStatusAsync(orderId, OrderStatus.Comfirmed.GetHashCode());

                        _cartService.ClearCart();

                        return Ok(response);
                    }
                }
                else
                {
                    order.Status = OrderStatus.Cancelled;
                    await _orderRepo.UpdateOrderStatusAsync(orderId, OrderStatus.Cancelled.GetHashCode());
                    foreach (var item in order.OrderItems)
                    {
                        var product = await _productRepo.GetProductByIdAsync(item.ProductId);
                        if (product != null)
                        {
                            product.Stock += item.Quantity;
                            await _productRepo.UpdateProductAsync(product.Id, product);
                        }
                        // remove order item
                        await _orderItemRepo.DeleteOrderItemByIdAsync(item.Id);

                    }

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
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi xử lý thanh toán", Error = ex.Message });
            }

            return BadRequest(new
            {
                Success = false,
                Message = "Thanh toán thất bại"
            });
        }

        [HttpPost]
        [Route("update-payment")]
        public async Task<IActionResult> UpdatePayment([FromBody] PaymentUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var order = await _orderRepo.GetOrderByIdAsync(request.OrderId);
                if (order == null)
                {
                    return BadRequest(new { Success = false, Message = "Đơn hàng không tồn tại" });
                }
                if (!Enum.IsDefined(typeof(PaymentMethod), request.PaymentMethod))
                {
                    return BadRequest(new { Success = false, Message = "Phương thức thanh toán không hợp lệ" });
                }


                order.TransactionId = request.TransactionId;
                order.PaymentMethod = request.PaymentMethod;
                order.Status = request.ResponseCode == "00" ? OrderStatus.Comfirmed : OrderStatus.Cancelled;

                await _orderRepo.UpdateOrderAsync(order);

                if (order.Status == OrderStatus.Comfirmed)
                {
                    _cartService.ClearCart();
                }

                if (order.Status == OrderStatus.Cancelled)
                {
                    var orderItems = await _orderItemRepo.GetOrderItemsByOrderIdAsync(order.Id);
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

                return Ok(new { Success = true, Message = "Cập nhật thanh toán thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Lỗi cập nhật thanh toán", Error = ex.Message });
            }
        }
    }


}
