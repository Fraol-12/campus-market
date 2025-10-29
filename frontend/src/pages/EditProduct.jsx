// frontend/src/pages/EditProduct.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', description: '', category: '', contact: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/products/${id}`, form);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
      <input name="price" type="number" value={form.price} onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
      <textarea name="description" value={form.description} onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
      <input name="category" value={form.category} onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
      <input name="e contact" value={form.contact} onChange={e => setForm({...form, [e.target.name]: e.target.value})} />
      <button type="submit">Update</button>
    </form>
  );
}