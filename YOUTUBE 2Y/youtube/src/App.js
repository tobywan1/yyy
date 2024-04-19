import React, { useState } from 'react';
import axios from 'axios';
import FeedPage from './FeedPage'; // Corrected import path
import ForgotPassword from './ForgotPassword';
import OTPVerification from './OTPVerification';
import ChangePassword from './ChangePassword';
import logo from './2f.jpg';
import './LoginForm.css';

const LoginForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Login with:", email, password);
      // Your login logic goes here
      setIsLoggedIn(true); // Assuming login is successful
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleSubscription = () => {
    console.log("Subscribe for premium use");
  };

  const handleCreateAccount = () => {
    setIsCreatingAccount(true);
  };

  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/register', { email, password });
      console.log(response.data);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsCreatingAccount(false); // Assuming account creation is successful
    } catch (error) {
      console.error('Error creating account:', error.response);
      setError(error.response?.data?.message || 'Error creating account. Please try again later.');
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <FeedPage />
      ) : (
        <div className="login-container">
          <img src={logo} alt="Logo" className="logo" />
          {isForgotPassword ? (
            isOTPVerified ? (
              <div className="form-container">
                <ChangePassword email={email} />
              </div>
            ) : (
              isEmailSent ? (
                <div className="form-container">
                  <OTPVerification email={email} setIsOTPVerified={setIsOTPVerified} />
                </div>
              ) : (
                <div className="form-container">
                  <ForgotPassword setEmailSent={setIsEmailSent} />
                </div>
              )
            )
          ) : (
            isCreatingAccount ? (
              <div className="form-container">
                <h2>Create an Account</h2>
                <form onSubmit={handleCreateAccountSubmit}>
                  <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                  <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </label>
                  <label>
                    Confirm Password:
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </label>
                  {error && <p className="error">{error}</p>}
                  <button type="submit">Create Account</button>
                </form>
                <button onClick={() => setIsCreatingAccount(false)} className="secondary-button">Back to Login</button>
              </div>
            ) : (
              <div className="form-container">
                <h2>Login Form</h2>
                <form onSubmit={handleLogin}>
                  <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                  <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </label>
                  <button type="submit">Login</button>
                </form>
                <div className="login-links">
                  <button onClick={handleCreateAccount} className="secondary-button">Create an Account</button>
                  <button onClick={handleForgotPassword} className="secondary-button">Forgot Password</button>
                  <button onClick={handleSubscription} className="secondary-button">Subscribe for Premium Use</button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
