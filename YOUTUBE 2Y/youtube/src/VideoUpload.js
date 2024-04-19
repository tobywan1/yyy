import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = ({ handleExit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('video', videoFile);
  
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setTitle('');
      setDescription('');
      setTags('');
      setVideoFile(null);
      setError('');
      handleExit();
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(
        error.response?.data?.message || 'Error uploading video. Please try again later.'
      );
    }
  };

  const handleExitClick = () => {
    handleExit();
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Tags:
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <br />
        <label>
          Video File:
          <input type="file" accept="video/*" onChange={handleFileChange} required />
        </label>
        <br />
        {error && <p className="error">{error}</p>}
        <button type="submit">Upload</button>
        <button type="button" onClick={handleExitClick}>
          Exit
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
