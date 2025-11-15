import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../QueryDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function CustomerQueryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuery = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/queries/${id}`);
        setQuery(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching query:', error);
        setLoading(false);
      }
    };
    
    loadQuery();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading">Loading query details...</div>;
  }

  if (!query) {
    return <div className="error">Query not found</div>;
  }

  return (
    <div className="query-detail-container">
      <div className="customer-header">
        <button className="btn btn-secondary" onClick={() => navigate('/customer/queries')}>
          ← Back to My Queries
        </button>
      </div>

      <div className="card">
        <div className="query-detail-header">
          <h2>{query.subject}</h2>
          <div className="query-badges">
            <span className={`badge badge-tag-${query.tag}`}>{query.tag}</span>
            <span className={`badge badge-priority-${query.priority}`}>{query.priority}</span>
            <span className={`badge badge-status-${query.status}`}>{query.status}</span>
          </div>
        </div>

        <div className="query-detail-info">
          <div className="info-row">
            <strong>Channel:</strong> {query.channel}
          </div>
          <div className="info-row">
            <strong>Submitted:</strong> {formatDate(query.createdAt)}
          </div>
          <div className="info-row">
            <strong>Last Updated:</strong> {formatDate(query.updatedAt)}
          </div>
          {query.assignedToName && (
            <div className="info-row">
              <strong>Assigned To:</strong> {query.assignedToName}
            </div>
          )}
          {query.resolvedAt && (
            <div className="info-row">
              <strong>Resolved:</strong> {formatDate(query.resolvedAt)}
            </div>
          )}
        </div>

        <div className="query-message">
          <h3>Your Message</h3>
          <p>{query.message}</p>
        </div>
      </div>

      {query.history && query.history.length > 0 && (
        <div className="card">
          <h3>Activity History</h3>
          <div className="history-list">
            {query.history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-action">{item.action}</div>
                <div className="history-meta">
                  {formatDate(item.timestamp)}
                  {item.note && <div style={{ marginTop: '0.25rem' }}>Note: {item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerQueryDetail;

