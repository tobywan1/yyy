// VideoDetailPage.js
import React from 'react';

const VideoDetailPage = ({ video, onBackToFeed }) => {
  return (
    <div className="video-detail-page">
      <h2>Video Detail Page</h2>
      <div className="video-detail">
        <video controls>
          <source src={video.videoFilePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-info">
          <h3>{video.title}</h3>
          <p>{video.description}</p>
        </div>
      </div>
      <button onClick={onBackToFeed}>Back to Feed</button>
    </div>
  );
};

export default VideoDetailPage;
