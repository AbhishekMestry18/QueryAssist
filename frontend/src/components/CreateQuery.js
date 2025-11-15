import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateQuery.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CreateQuery() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    channel: 'email',
    senderName: '',
    senderEmail: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.senderName || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/queries`, formData);
      alert('Query created successfully! Auto-tagging and priority detection applied.');
      navigate(`/query/${response.data._id}`);
    } catch (error) {
      console.error('Error creating query:', error);
      alert('Error creating query');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="create-query-container">
      <div className="card">
        <h2>Create New Query</h2>
        <p className="subtitle">The system will automatically tag and prioritize this query</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Channel *</label>
            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              required
            >
              <option value="email">Email</option>
              <option value="social">Social Media</option>
              <option value="chat">Chat</option>
              <option value="community">Community</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sender Name *</label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Sender Email</label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Query subject"
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Enter the query message. The system will automatically detect if it's a question, request, complaint, feedback, or other, and assign priority."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Query'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuery;

