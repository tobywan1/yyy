import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = ({ currentUser, onBackToFeed }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      fetchUserVideos(currentUser._id);
    }
  }, [currentUser]);

  const fetchUserVideos = async (userId) => {
    try {
      const response = await axios.get(`/api/videos/${userId}`);
      console.log('User videos:', response.data); // Log user videos to check if they are retrieved correctly
      setVideos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user videos:', error);
      setIsLoading(false);
    }
  };
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(`/api/users/${currentUser._id}`, {
        username,
        email,
      });
      console.log('User updated:', response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>

      <h2>My Videos</h2>
      <div className="video-list">
        {videos.map(video => (
          <div key={video._id} className="video">
            <video controls>
              <source src={video.videoFilePath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onBackToFeed}>Back to Feed</button>
    </div>
  );
};

export default ProfilePage;
