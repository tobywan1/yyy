// ParentComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilePage from './ProfilePage'; // Import ProfilePage component

const ParentComponent = ({ currentUser }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div>
      {/* Render ProfilePage and pass currentUser and videos props */}
      <ProfilePage currentUser={currentUser} videos={videos} />
    </div>
  );
};

export default ParentComponent;
