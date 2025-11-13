import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    purchase_date: new Date().toISOString().slice(0, 10),
    items: [{ product_id: '', quantity: 1, price: 0 }],
  });

  const fetchPurchases = () => {
    window.api.runQuery("SELECT * FROM purchases ORDER BY purchase_date DESC").then(setPurchases);
  };

  const fetchProducts = () => {
    window.api.runQuery("SELECT * FROM products ORDER BY name").then(setProducts);
  };

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...newPurchase.items];
    if (name === 'quantity') {
      items[index][name] = parseInt(value, 10);
    } else if (name === 'price') {
      items[index][name] = parseFloat(value);
    } else {
      items[index][name] = value;
    }
    setNewPurchase(prev => ({ ...prev, items }));
  };

  const addItem = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    const items = [...newPurchase.items];
    items.splice(index, 1);
    setNewPurchase(prev => ({ ...prev, items }));
  };

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    const { supplier, purchase_date, items } = newPurchase;
    const total_amount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const purchaseSql = `INSERT INTO purchases (supplier, purchase_date, total_amount) VALUES (?, ?, ?)`;
    const purchaseResult = await window.api.runQuery(purchaseSql, [supplier, purchase_date, total_amount]);

    for (const item of items) {
      const itemSql = `INSERT INTO purchase_items (purchase_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
      await window.api.runQuery(itemSql, [purchaseResult.lastID, item.product_id, item.quantity, item.price]);
      const updateProductSql = `UPDATE products SET quantity = quantity + ? WHERE id = ?`;
      await window.api.runQuery(updateProductSql, [item.quantity, item.product_id]);
    }

    fetchPurchases();
    fetchProducts(); // To reflect new stock
    setShowAddModal(false);
    setNewPurchase({ supplier: '', purchase_date: new Date().toISOString().slice(0, 10), items: [{ product_id: '', quantity: 1, price: 0 }] });
  };

  const viewDetails = async (purchase) => {
    const itemsSql = `
      SELECT pi.*, p.name as product_name 
      FROM purchase_items pi 
      JOIN products p ON pi.product_id = p.id 
      WHERE pi.purchase_id = ?`;
    const items = await window.api.runQuery(itemsSql, [purchase.id]);
    setSelectedPurchase({ ...purchase, items });
    setShowDetailsModal(true);
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm('Are you sure you want to delete this purchase? This will revert the stock changes.')) {
      const itemsSql = `SELECT product_id, quantity FROM purchase_items WHERE purchase_id = ?`;
      const items = await window.api.runQuery(itemsSql, [purchaseId]);

      for (const item of items) {
        const updateProductSql = `UPDATE products SET quantity = quantity - ? WHERE id = ?`;
        await window.api.runQuery(updateProductSql, [item.quantity, item.product_id]);
      }

      await window.api.runQuery(`DELETE FROM purchase_items WHERE purchase_id = ?`, [purchaseId]);
      await window.api.runQuery(`DELETE FROM purchases WHERE id = ?`, [purchaseId]);

      fetchPurchases();
      fetchProducts();
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Purchases</h2>
        <button onClick={() => setShowAddModal(true)}>
          <FaPlus style={{ marginRight: '5px' }} />
          Add Purchase
        </button>
      </div>

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <form onSubmit={handleAddPurchase}>
          <h3>Add New Purchase</h3>
          <label>
            Supplier:
            <input type="text" name="supplier" value={newPurchase.supplier} onChange={handleInputChange} />
          </label>
          <label>
            Date:
            <input type="date" name="purchase_date" value={newPurchase.purchase_date} onChange={handleInputChange} required />
          </label>

          <h4>Items</h4>
          {newPurchase.items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select name="product_id" value={item.product_id} onChange={(e) => handleItemChange(index, e)} required>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" required style={{ width: '100px' }} />
              <input type="number" name="price" value={item.price} step="0.01" onChange={(e) => handleItemChange(index, e)} placeholder="Price" required style={{ width: '100px' }} />
              <button type="button" onClick={() => removeItem(index)} style={{ backgroundColor: '#dc3545' }}><FaTrash /></button>
            </div>
          ))}
          <button type="button" onClick={addItem}><FaPlus /> Add Item</button>

          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button type="submit">Save Purchase</button>
          </div>
        </form>
      </Modal>

      {selectedPurchase && (
        <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
          <h3>Purchase Details</h3>
          <p><strong>ID:</strong> {selectedPurchase.id}</p>
          <p><strong>Date:</strong> {selectedPurchase.purchase_date}</p>
          <p><strong>Supplier:</strong> {selectedPurchase.supplier}</p>
          <p><strong>Total Amount:</strong> ${selectedPurchase.total_amount.toFixed(2)}</p>
          <h4>Items</h4>
          <ul>
            {selectedPurchase.items.map(item => (
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
            <th>Supplier</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No purchases found</td>
            </tr>
          ) : (
            purchases.map(purchase => (
              <tr key={purchase.id}>
                <td>{purchase.id}</td>
                <td>{purchase.purchase_date}</td>
                <td>{purchase.supplier}</td>
                <td>${purchase.total_amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => viewDetails(purchase)} style={{ marginRight: '5px' }}><FaEye /></button>
                  <button onClick={() => handleDeletePurchase(purchase.id)} style={{ backgroundColor: '#dc3545' }}><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Purchases;

