import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [newSale, setNewSale] = useState({
    customer: '',
    sale_date: new Date().toISOString().slice(0, 10),
    items: [{ product_id: '', quantity: 1, price: 0 }],
  });

  const fetchSales = () => {
    window.api.runQuery("SELECT * FROM sales ORDER BY sale_date DESC").then(setSales);
  };

  const fetchProducts = () => {
    window.api.runQuery("SELECT * FROM products ORDER BY name").then(setProducts);
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...newSale.items];
    if (name === 'quantity') {
        items[index][name] = parseInt(value, 10) || 0;
    } else if (name === 'price') {
        items[index][name] = parseFloat(value) || 0;
    } else if (name === 'product_id') {
        const product = products.find(p => p.id === parseInt(value));
        items[index]['price'] = product ? product.price : 0;
        items[index][name] = value;
    } else {
        items[index][name] = value;
    }
    setNewSale(prev => ({ ...prev, items }));
  };

  const addItem = () => {
    setNewSale(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    const items = [...newSale.items];
    items.splice(index, 1);
    setNewSale(prev => ({ ...prev, items }));
  };

  const handleAddSale = async (e) => {
    e.preventDefault();

    for (const item of newSale.items) {
      const product = products.find(p => p.id === parseInt(item.product_id));
      if (!product || item.quantity > product.quantity) {
        alert(`Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
        return;
      }
    }

    const { customer, sale_date, items } = newSale;
    const total_amount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const saleSql = `INSERT INTO sales (customer, sale_date, total_amount) VALUES (?, ?, ?)`;
    const saleResult = await window.api.runQuery(saleSql, [customer, sale_date, total_amount]);

    for (const item of items) {
      const itemSql = `INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
      await window.api.runQuery(itemSql, [saleResult.lastID, item.product_id, item.quantity, item.price]);
      const updateProductSql = `UPDATE products SET quantity = quantity - ? WHERE id = ?`;
      await window.api.runQuery(updateProductSql, [item.quantity, item.product_id]);
    }

    fetchSales();
    fetchProducts();
    setShowAddModal(false);
    setNewSale({ customer: '', sale_date: new Date().toISOString().slice(0, 10), items: [{ product_id: '', quantity: 1, price: 0 }] });
  };

  const viewDetails = async (sale) => {
    const itemsSql = `
      SELECT si.*, p.name as product_name 
      FROM sale_items si 
      JOIN products p ON si.product_id = p.id 
      WHERE si.sale_id = ?`;
    const items = await window.api.runQuery(itemsSql, [sale.id]);
    setSelectedSale({ ...sale, items });
    setShowDetailsModal(true);
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale? This will revert the stock changes.')) {
      const itemsSql = `SELECT product_id, quantity FROM sale_items WHERE sale_id = ?`;
      const items = await window.api.runQuery(itemsSql, [saleId]);

      for (const item of items) {
        const updateProductSql = `UPDATE products SET quantity = quantity + ? WHERE id = ?`;
        await window.api.runQuery(updateProductSql, [item.quantity, item.product_id]);
      }

      await window.api.runQuery(`DELETE FROM sale_items WHERE sale_id = ?`, [saleId]);
      await window.api.runQuery(`DELETE FROM sales WHERE id = ?`, [saleId]);

      fetchSales();
      fetchProducts();
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Sales</h2>
        <button onClick={() => setShowAddModal(true)}>
          <FaPlus style={{ marginRight: '5px' }} />
          Add Sale
        </button>
      </div>

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <form onSubmit={handleAddSale}>
          <h3>Add New Sale</h3>
          <label>
            Customer:
            <input type="text" name="customer" value={newSale.customer} onChange={handleInputChange} />
          </label>
          <label>
            Date:
            <input type="date" name="sale_date" value={newSale.sale_date} onChange={handleInputChange} required />
          </label>

          <h4>Items</h4>
          {newSale.items.map((item, index) => {
            const product = products.find(p => p.id === parseInt(item.product_id));
            const stock = product ? product.quantity : 0;
            const isInvalid = item.quantity > stock;
            return (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', border: isInvalid ? '1px solid red' : 'none', padding: isInvalid ? '5px': 0 }}>
                <select name="product_id" value={item.product_id} onChange={(e) => handleItemChange(index, e)} required>
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
                  ))}
                </select>
                <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" required style={{ width: '100px' }} />
                <input type="number" name="price" value={item.price} step="0.01" onChange={(e) => handleItemChange(index, e)} placeholder="Price" required style={{ width: '100px' }} />
                <button type="button" onClick={() => removeItem(index)} style={{ backgroundColor: '#dc3545' }}><FaTrash /></button>
              </div>
            )
          })}
          <button type="button" onClick={addItem}><FaPlus /> Add Item</button>

          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button type="submit">Save Sale</button>
          </div>
        </form>
      </Modal>

      {selectedSale && (
        <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
          <h3>Sale Details</h3>
          <p><strong>ID:</strong> {selectedSale.id}</p>
          <p><strong>Date:</strong> {selectedSale.sale_date}</p>
          <p><strong>Customer:</strong> {selectedSale.customer}</p>
          <p><strong>Total Amount:</strong> ${selectedSale.total_amount.toFixed(2)}</p>
          <h4>Items</h4>
          <ul>
            {selectedSale.items.map(item => (
              <li key={item.id}>
                {item.product_name} - {item.quantity} @ ${item.price.toFixed(2)} each
              </li>
            ))}
          </ul>
        </Modal>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No sales found</td>
            </tr>
          ) : (
            sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                <td>{sale.customer}</td>
                <td>${sale.total_amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => viewDetails(sale)} style={{ marginRight: '5px' }}><FaEye /></button>
                  <button onClick={() => handleDeleteSale(sale.id)} style={{ backgroundColor: '#dc3545' }}><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Sales;

