import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Inbox.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function CustomerQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQueries = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/queries`);
      setQueries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queries:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  if (loading) {
    return <div className="loading">Loading your queries...</div>;
  }

  return (
    <div className="inbox-container">
      <div className="customer-header">
        <div>
          <h2>My Queries</h2>
          <p className="subtitle">Track the status of your submitted queries</p>
        </div>
        <div className="customer-actions">
          <button className="btn btn-primary" onClick={() => navigate('/customer/create')}>
            + New Query
          </button>
        </div>
      </div>

      <div className="card">
        <div className="query-list">
          {queries.length === 0 ? (
            <div className="loading">
              <p>No queries yet. Create your first query!</p>
              <button className="btn btn-primary" onClick={() => navigate('/customer/create')} style={{ marginTop: '1rem' }}>
                Create Query
              </button>
            </div>
          ) : (
            queries.map(query => (
              <div 
                key={query._id} 
                className="query-item"
                onClick={() => navigate(`/customer/query/${query._id}`)}
              >
                <div className="query-header">
                  <div>
                    <div className="query-title">{query.subject}</div>
                    <div className="query-meta">
                      <span>{query.channel}</span>
                      <span>•</span>
                      <span>{formatDate(query.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="query-preview">{query.message}</div>
                <div className="query-badges">
                  <span className={`badge badge-tag-${query.tag}`}>
                    {query.tag}
                  </span>
                  <span className={`badge badge-priority-${query.priority}`}>
                    {query.priority}
                  </span>
                  <span className={`badge badge-status-${query.status}`}>
                    {query.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerQueries;

