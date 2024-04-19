// FeedPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoUpload from './VideoUpload';
import ProfilePage from './ProfilePage';
import './FeedPage.css';
import VideoDetailPage from './VideoDetailPage';
import StreamingSetup from './StreamingSetup';

const FeedPage = ({ currentUser }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('feed');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false); // Add state for streaming
  const [showStreamingSetup, setShowStreamingSetup] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const handleExitUpload = () => {
    setShowUploadForm(false);
    fetchVideos(); // Refresh videos after upload
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setCurrentPage('videoDetail');
  };

  const handleStreamingClick = () => {
    setIsStreaming(prevState => !prevState); // Toggle streaming state
  };

  const handleStartStream = (streamData) => {
    // You can handle starting the stream here, e.g., calling an API to start the stream
    console.log('Starting stream with data:', streamData);
    setIsStreaming(true);
    setShowStreamingSetup(false); // Hide streaming setup after starting the stream
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`/api/videos/${videoId}`);
      fetchVideos(); // Refresh videos after deletion
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleBackToProfile = () => {
    setSelectedVideo(null);
    setCurrentPage('feed');
  };

  return (
    <div className="feed-page">
      <header className="header">
        {/* Header content */}
      </header>
      <button className="profile-button" onClick={() => setCurrentPage('profile')}>Profile</button>

      {currentPage === 'profile' && currentUser && !isLoading && (
        <ProfilePage currentUser={currentUser} videos={videos} />
      )}

      {currentPage === 'feed' && !showUploadForm && (
        <div className="video-feed">
          {videos.map(video => (
            <div key={video._id} className="video" onClick={() => handleVideoClick(video)}>
              <video controls>
                <source src={video.videoFilePath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-info">
                <h2>{video.title}</h2>
                <p>{video.description}</p>
              </div>
              {currentUser && currentUser._id === video.uploader && (
                <button onClick={() => handleDelete(video._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}

      {showUploadForm && <VideoUpload handleExit={handleExitUpload} />}

      <div className="fixed-buttons-container">
        <button className="upload-button" onClick={handleUploadClick}>Upload Video</button>
        
        {/* Render "Start Streaming" button when not streaming */}
        {!isStreaming && (
          <button className="stream-button" onClick={handleStreamingClick}>
            Start Streaming
          </button>
        )}
        
        {/* Render "Stop Streaming" button when streaming */}
        {isStreaming && (
          <button className="stream-button" onClick={handleStreamingClick}>
            Stop Streaming
          </button>
        )}
      </div>

      {/* Render StreamingSetup component when showStreamingSetup is true */}
      {showStreamingSetup && <StreamingSetup onStartStream={handleStartStream} />}

      {/* Render VideoDetailPage component when currentPage is 'videoDetail' */}
      {currentPage === 'videoDetail' && (
        <VideoDetailPage video={selectedVideo} onBackToFeed={handleBackToProfile} />
      )}
    </div>
  );
};

export default FeedPage;
