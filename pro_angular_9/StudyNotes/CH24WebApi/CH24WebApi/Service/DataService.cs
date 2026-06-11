using CH24WebApi.Model;

namespace CH24WebApi.Service
{
    public interface IDataService
    {
        List<Product> GetProducts();
        Product AddProduct(Product product);
        Product UpdateProduct(int id, Product product);
        Product Delete(int id);
    }
    public class DataService : IDataService
    {
        private List<Product> _products = null;
        private int CurrentMaxId = 9;
        public DataService()
        {
            _products = new List<Product> {
                new Product { Id = 1, Name ="Kayak", Category = "Watersports", Price = 275 },
                new Product { Id = 2, Name ="Lifejacket", Category = "Watersports", Price = 48.95 },
                new Product { Id = 3, Name ="Soccer Ball", Category = "Soccer", Price = 19.50 },
                new Product { Id = 4, Name ="Corner Flags", Category = "Soccer", Price = 34.95 },
                new Product { Id = 5, Name ="Stadium", Category = "Soccer", Price = 79500 },
                new Product { Id = 6, Name ="Thinking Cap", Category = "Chess", Price = 16 },
                new Product { Id = 7, Name ="Unsteady Chair", Category = "Chess", Price = 29.95 },
                new Product { Id = 8, Name ="Human Chess Board", Category = "Chess", Price = 75 },
                new Product { Id = 9, Name ="Bling Bling King", Category = "Chess", Price = 1200 },
            };
        }

        public List<Product> GetProducts()
        {
            return _products;
        }

        public Product AddProduct(Product product)
        {
            if (product != null && product.Id == 0)
            {
                CurrentMaxId = CurrentMaxId + 1;    
                product.Id = CurrentMaxId;
                _products.Add(product);
            }

            return product;
        }

        public Product UpdateProduct(int id, Product product)
        {
            Product _modifiedProduct = new Product();
            if (product != null && product.Id > 0)
            {
                _modifiedProduct = _products.Where(p => p.Id == id).FirstOrDefault();
                _modifiedProduct.Name = product.Name;
                _modifiedProduct.Category = product.Category;
                _modifiedProduct.Price = product.Price;
            }

            return _modifiedProduct;
        }

        public Product Delete(int id)
        { 
            Product _deletedProduct = new Product();
            if (id > 0)
            {
                _deletedProduct = _products.Where(p => p.Id == id).FirstOrDefault();
                if (_deletedProduct != null)
                {
                    _products.Remove(_deletedProduct);
                }
            }

            return _deletedProduct;
        }
    }
}
