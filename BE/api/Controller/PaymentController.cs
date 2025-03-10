using api.DTOs.CheckOut;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    public class PaymentController : ControllerBase
    {

        private readonly IVnPayService _vnPayService;
        public PaymentController(IVnPayService vnPayService)
        {

            _vnPayService = vnPayService;
        }

        public IActionResult CreatePaymentUrlVnpay(PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Redirect(url);
        }
        [HttpGet]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            return Json(response);
        }

        private IActionResult Json(PaymentResponseModel response)
        {
            throw new NotImplementedException();
        }
    }
}



