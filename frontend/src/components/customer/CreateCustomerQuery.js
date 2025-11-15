import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CreateQuery.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CreateCustomerQuery() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    channel: 'email',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/queries`, formData);
      alert('Query submitted successfully! Our team will get back to you soon.');
      navigate('/customer/queries');
    } catch (error) {
      console.error('Error creating query:', error);
      alert('Error submitting query. Please try again.');
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
        <h2>Submit a Query</h2>
        <p className="subtitle">We'll automatically categorize and prioritize your query</p>

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
            <label>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Brief description of your query"
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Describe your query in detail..."
              rows="6"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Query'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/customer/queries')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCustomerQuery;

