import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Inbox.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Memoized date formatter
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function Inbox() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    tag: '',
    priority: '',
    channel: ''
  });
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

  // Memoized filtered queries - only recalculates when queries or filters change
  const filteredQueries = useMemo(() => {
    let filtered = [...queries];
    
    if (filters.status) {
      filtered = filtered.filter(q => q.status === filters.status);
    }
    if (filters.tag) {
      filtered = filtered.filter(q => q.tag === filters.tag);
    }
    if (filters.priority) {
      filtered = filtered.filter(q => q.priority === filters.priority);
    }
    if (filters.channel) {
      filtered = filtered.filter(q => q.channel === filters.channel);
    }
    
    return filtered;
  }, [queries, filters]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ status: '', tag: '', priority: '', channel: '' });
  }, []);

  if (loading) {
    return <div className="loading">Loading queries...</div>;
  }

  return (
    <div className="inbox-container">
      <div className="card">
        <h2>Unified Inbox</h2>
        <p className="subtitle">All audience queries in one place</p>
        
        <div className="filters">
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select 
            value={filters.tag} 
            onChange={(e) => handleFilterChange('tag', e.target.value)}
          >
            <option value="">All Tags</option>
            <option value="question">Question</option>
            <option value="request">Request</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
          
          <select 
            value={filters.priority} 
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <select 
            value={filters.channel} 
            onChange={(e) => handleFilterChange('channel', e.target.value)}
          >
            <option value="">All Channels</option>
            <option value="email">Email</option>
            <option value="social">Social Media</option>
            <option value="chat">Chat</option>
            <option value="community">Community</option>
          </select>
          
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="query-count">
          Showing {filteredQueries.length} of {queries.length} queries
        </div>

        <div className="query-list">
          {filteredQueries.length === 0 ? (
            <div className="loading">No queries found</div>
          ) : (
            filteredQueries.map(query => (
              <div 
                key={query._id} 
                className="query-item"
                onClick={() => navigate(`/admin/query/${query._id}`)}
              >
                <div className="query-header">
                  <div>
                    <div className="query-title">{query.subject}</div>
                    <div className="query-meta">
                      <span>From: {query.senderName}</span>
                      <span>•</span>
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
                  {query.assignedToName && (
                    <span className="badge badge-tag-other">
                      Assigned: {query.assignedToName}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Inbox;

