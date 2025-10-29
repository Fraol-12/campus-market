import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductsList from './pages/ProductsList';
import AddProduct from './pages/AddProduct';
import VerifySuccess from './pages/VerifySuccess';
import AuthSuccess from './pages/AuthSuccess';
import SellerDashboard from './pages/SellerDashboard';
import EditProduct from './pages/EditProduct';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><SellerDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;