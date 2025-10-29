import { Link } from 'react-router-dom';

export default function VerifySuccess() {
  return (
    <div className="success-page">
    <h1>Verified!</h1>
    <p>Your email is confirmed.</p>
    <Link to="/login" className="btn-primary">Go to Login</Link>
    </div>
  );
}