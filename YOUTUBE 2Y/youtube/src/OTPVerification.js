// OTPVerification.js

import React, { useState } from 'react';
import axios from 'axios';

const OTPVerification = ({ email, setIsOTPVerified }) => {
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      // Send OTP verification request to the backend
      const response = await axios.post('/api/verifyotp', { email, otp });
      // Check if OTP verification was successful
      if (response.status === 200) {
        // Update state to indicate OTP is verified
        setIsOTPVerified(true);
        // Redirect or navigate to the next page here
        // Example: history.push('/change-password');
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify OTP. Please try again.'); // Set an error message
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <form onSubmit={handleVerifyOTP}>
        <label>
          OTP:
          <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Verify OTP</button>
        {error && <p>{error}</p>} {/* Display error message if there's an error */}
      </form>
    </div>
  );
};

export default OTPVerification;