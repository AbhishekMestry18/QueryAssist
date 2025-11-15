import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QueryDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function QueryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    assignedTo: '',
    note: ''
  });

  useEffect(() => {
    // Fetch query and teams in parallel for better performance
    const loadData = async () => {
      setLoading(true);
      try {
        const [queryResponse, teamsResponse] = await Promise.all([
          axios.get(`${API_URL}/queries/${id}`),
          axios.get(`${API_URL}/teams`)
        ]);
        
        setQuery(queryResponse.data);
        setTeams(teamsResponse.data);
        setFormData({
          status: queryResponse.data.status,
          assignedTo: queryResponse.data.assignedTo?._id || '',
          note: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleAssign = async () => {
    if (!formData.assignedTo) {
      alert('Please select a team');
      return;
    }

    setAssigning(true);
    try {
      const selectedTeam = teams.find(t => t._id === formData.assignedTo);
      const response = await axios.put(`${API_URL}/queries/${id}`, {
        assignedTo: formData.assignedTo,
        assignedToName: selectedTeam.name,
        performedBy: 'Admin'
      });
      setQuery(response.data);
      setFormData(prev => ({ ...prev, assignedTo: '', note: '' }));
      alert('Query assigned successfully');
    } catch (error) {
      console.error('Error assigning query:', error);
      alert('Error assigning query');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!formData.status) {
      alert('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(`${API_URL}/queries/${id}`, {
        status: formData.status,
        note: formData.note,
        performedBy: 'Admin'
      });
      setQuery(response.data);
      setFormData(prev => ({ ...prev, status: query.status, note: '' }));
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  // Memoized date formatter
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  if (loading) {
    return <div className="loading">Loading query details...</div>;
  }

  if (!query) {
    return <div className="error">Query not found</div>;
  }

  return (
    <div className="query-detail-container">
      <button className="btn btn-secondary" onClick={() => navigate('/admin/inbox')} style={{ marginBottom: '1rem' }}>
        ← Back to Inbox
      </button>

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
            <strong>From:</strong> {query.senderName} {query.senderEmail && `(${query.senderEmail})`}
          </div>
          <div className="info-row">
            <strong>Channel:</strong> {query.channel}
          </div>
          <div className="info-row">
            <strong>Created:</strong> {formatDate(query.createdAt)}
          </div>
          <div className="info-row">
            <strong>Last Updated:</strong> {formatDate(query.updatedAt)}
          </div>
          {query.assignedTo && (
            <div className="info-row">
              <strong>Assigned To:</strong> {query.assignedTo.name} ({query.assignedTo.department})
            </div>
          )}
          {query.resolvedAt && (
            <div className="info-row">
              <strong>Resolved:</strong> {formatDate(query.resolvedAt)}
            </div>
          )}
          {query.responseTime > 0 && (
            <div className="info-row">
              <strong>Response Time:</strong> {query.responseTime} minutes
            </div>
          )}
        </div>

        <div className="query-message">
          <h3>Message</h3>
          <p>{query.message}</p>
        </div>
      </div>

      <div className="card">
        <h3>Update Query</h3>
        
        <div className="form-group">
          <label>Assign to Team</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              style={{ flex: 1 }}
            >
              <option value="">Select a team</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name} - {team.department}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary" 
              onClick={handleAssign}
              disabled={assigning}
            >
              {assigning ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Update Status</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              style={{ flex: 1 }}
            >
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button 
              className="btn btn-success" 
              onClick={handleStatusUpdate}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Note (optional)</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            placeholder="Add a note about this update..."
          />
        </div>
      </div>

      {query.history && query.history.length > 0 && (
        <div className="card">
          <h3>History</h3>
          <div className="history-list">
            {query.history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-action">{item.action}</div>
                <div className="history-meta">
                  By {item.performedBy} on {formatDate(item.timestamp)}
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

export default QueryDetail;

