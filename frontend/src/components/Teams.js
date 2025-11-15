import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Teams.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.department) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/teams`, formData);
      fetchTeams();
      setFormData({ name: '', email: '', department: '' });
      setShowForm(false);
      alert('Team created successfully');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/teams/${id}`);
      fetchTeams();
      alert('Team deleted successfully');
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team');
    }
  };

  if (loading) {
    return <div className="loading">Loading teams...</div>;
  }

  return (
    <div className="teams-container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Teams</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Team'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Add New Team</h3>
            <div className="form-group">
              <label>Team Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Support Team"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="support@example.com"
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                required
                placeholder="Customer Support"
              />
            </div>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        )}

        {teams.length === 0 ? (
          <div className="loading">No teams found. Create your first team above.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team._id}>
                  <td>{team.name}</td>
                  <td>{team.email}</td>
                  <td>{team.department}</td>
                  <td>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(team._id)}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Teams;

