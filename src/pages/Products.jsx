import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    } else {
      setEditingProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const { name, description, quantity, price } = newProduct;
    const sql = `INSERT INTO products (name, description, quantity, price) VALUES (?, ?, ?, ?)`;
    const params = [name, description, quantity, price];
    window.api.runQuery(sql, params).then(() => {
      fetchProducts();
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
    }).catch(err => {
      console.error(err);
    });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const { id, name, description, quantity, price } = editingProduct;
    const sql = `UPDATE products SET name = ?, description = ?, quantity = ?, price = ? WHERE id = ?`;
    const params = [name, description, quantity, price, id];
    window.api.runQuery(sql, params).then(() => {
      fetchProducts();
      setShowEditModal(false);
      setEditingProduct(null);
    }).catch(err => {
      console.error(err);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const sql = `DELETE FROM products WHERE id = ?`;
      window.api.runQuery(sql, [id]).then(() => {
        fetchProducts();
      }).catch(err => {
        console.error(err);
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Products</h2>
        <button onClick={() => setShowAddModal(true)}>
          <FaPlus style={{ marginRight: '5px' }} />
          Add Product
        </button>
      </div>
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <form onSubmit={handleAddProduct}>
          <h3>Add New Product</h3>
          <label>
            Name:
            <input type="text" name="name" value={newProduct.name} onChange={(e) => handleInputChange(e, 'add')} required />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={newProduct.description} onChange={(e) => handleInputChange(e, 'add')} />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={newProduct.quantity} onChange={(e) => handleInputChange(e, 'add')} required />
          </label>
          <label>
            Price:
            <input type="number" name="price" value={newProduct.price} step="0.01" onChange={(e) => handleInputChange(e, 'add')} required />
          </label>
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button type="submit">Add</button>
          </div>
        </form>
      </Modal>

      {editingProduct && (
        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleUpdateProduct}>
            <h3>Edit Product</h3>
            <label>
              Name:
              <input type="text" name="name" value={editingProduct.name} onChange={(e) => handleInputChange(e, 'edit')} required />
            </label>
            <label>
              Description:
              <input type="text" name="description" value={editingProduct.description} onChange={(e) => handleInputChange(e, 'edit')} />
            </label>
            <label>
              Quantity:
              <input type="number" name="quantity" value={editingProduct.quantity} onChange={(e) => handleInputChange(e, 'edit')} required />
            </label>
            <label>
              Price:
              <input type="number" name="price" value={editingProduct.price} step="0.01" onChange={(e) => handleInputChange(e, 'edit')} required />
            </label>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button type="submit">Update</button>
            </div>
          </form>
        </Modal>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No products found</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => handleEditClick(product)} style={{ marginRight: '5px' }}><FaEdit /></button>
                  <button onClick={() => handleDelete(product.id)} style={{ backgroundColor: '#dc3545' }}><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
