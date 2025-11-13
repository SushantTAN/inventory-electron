import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    window.api.runQuery("SELECT * FROM products").then(rows => {
      setProducts(rows);
    }).catch(err => {
      console.error(err);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Inventory</h1>
      <button>Add Product</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4">No products found</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;

