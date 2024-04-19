// ChangePassword.js

import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      // Handle password mismatch error
      return;
    }
    try {
      // Change password with backend
      await axios.post('/api/changepassword', { email, newPassword });
      // Password changed successfully
    } catch (error) {
      console.error('Error changing password:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <br />
        <label>
          Confirm New Password:
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChangePassword;