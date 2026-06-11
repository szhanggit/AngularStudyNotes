using CH24WebApi.Model;
using CH24WebApi.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CH24WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private IDataService _dataService;

        public ProductsController(IDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_dataService.GetProducts());
        }

        [HttpPost]
        public IActionResult Create(Product product)
        {
            Product _newProduct;
            _newProduct = _dataService.AddProduct(product);
            return Ok(_newProduct);
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, Product product)
        {
            Product _modifiedProduct;
            _modifiedProduct = _dataService.UpdateProduct(id, product);
            return Ok(_modifiedProduct);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            Product _deletedProduct;
            _deletedProduct = _dataService.Delete(id);
            if (_deletedProduct.Id > 0)
            {
                return Ok(_deletedProduct);
            }
            else
            {
                return BadRequest(_deletedProduct);
            }
            
        }
    }
}
