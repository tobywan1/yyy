// StreamingSetup.js
import React, { useState } from 'react';

const StreamingSetup = ({ onStartStream }) => {
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamTags, setStreamTags] = useState('');

  const handleStartStream = () => {
    onStartStream({
      title: streamTitle,
      description: streamDescription,
      tags: streamTags.split(',').map(tag => tag.trim()), // Convert string of tags to array
    });
  };

  return (
    <div>
      <h2>Setup Your Stream</h2>
      <label>
        Title:
        <input type="text" value={streamTitle} onChange={(e) => setStreamTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Description:
        <textarea value={streamDescription} onChange={(e) => setStreamDescription(e.target.value)} />
      </label>
      <br />
      <label>
        Tags:
        <input type="text" value={streamTags} onChange={(e) => setStreamTags(e.target.value)} />
      </label>
      <br />
      <button onClick={handleStartStream}>Start Stream</button>
    </div>
  );
};

export default StreamingSetup;
