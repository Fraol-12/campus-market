import { useState } from 'react';
import axios from 'axios';
import '../styles/AddProduct.css';

export default function AddProduct() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    contact: '',
  });
  const [images, setImages] = useState(null);
  const [msg, setMsg] = useState('');

  // ---- text inputs -------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---- file input --------------------------------------------------
  const handleFiles = (e) => {
    setImages(e.target.files);
  };

  // ---- submit ------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // add text fields
    for (const key in form) {
      if (form[key]) data.append(key, form[key]);
    }

    // add images (multiple)
    if (images) {
      for (const file of images) {
        data.append('images', file);
      }
    }

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg('Product added!');
      setForm({ title: '', price: '', description: '', category: '', contact: '' });
      setImages(null);
      document.getElementById('file-input').value = '';
    } catch (err) {
      console.error(err);
      setMsg('Failed – check console');
    }
  };

  return (
    <div className="add-page">
      <h2>Add a New Product</h2>

      {msg && <p className="msg">{msg}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          required
        />
        <input
          name="category"
          placeholder="Category (e.g. electronics)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          name="contact"
          placeholder="Email / Phone"
          value={form.contact}
          onChange={handleChange}
          required
        />
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}