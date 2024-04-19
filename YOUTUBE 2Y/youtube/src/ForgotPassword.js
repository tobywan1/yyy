import React, { useState } from 'react';
import axios from 'axios';
import OTPVerification from './OTPVerification'; // Import OTPVerification component

const ForgotPassword = ({ setEmailSent }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Add state to track if OTP has been sent

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      // Send email to backend to generate OTP and send it
      const response = await axios.post('/api/sendotp', { email });
      if (response.status === 200) {
        // Update the state to indicate that the email has been sent
        setOtpSent(true);
        setEmailSent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.'); // Set an error message
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {otpSent ? ( // Render OTPVerification component if OTP has been sent
        <OTPVerification email={email} />
      ) : (
        <form onSubmit={handleSendOTP}>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <button type="submit">Send OTP</button>
          {error && <p>{error}</p>} {/* Display error message if there's an error */}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
