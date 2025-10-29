import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../styles/ProductsList.css';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const url = category
          ? `http://localhost:5000/api/products?category=${category}`
          : 'http://localhost:5000/api/products';
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [category]);

  return (
    <div className="products-page">
      <h2>Products</h2>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="filter"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
        {/* add more categories as needed */}
      </select>

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default ProductsList;