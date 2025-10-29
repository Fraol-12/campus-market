// frontend/src/pages/SellerDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/mine');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Refresh after coming back from AddProduct
  useEffect(() => {
    const handleFocus = () => loadProducts();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  if (loading) return <p className="loading">Loading your products...</p>;

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">
        Your Products ({products.length})
      </h2>

      <Link to="/add-product">
        <button className="btn-primary mb-6">Add New Product</button>
      </Link>

      {products.length === 0 ? (
        <p className="text-gray-600">
          No products yet. <Link to="/add-product" className="text-blue-600 underline">Add one</Link>
        </p>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              {p.images[0] && (
                <img
                  src={`http://localhost:5000/${p.images[0]}`}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="info">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="price">${p.price}</p>
                <p className="text-sm text-gray-600">{p.category}</p>

                <div className="actions mt-3">
                  <Link to={`/edit-product/${p._id}`}>
                    <button className="edit">Edit</button>
                  </Link>
                  <button onClick={() => deleteProduct(p._id)} className="delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}