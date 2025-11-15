import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Analytics.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="error">Error loading analytics</div>;
  }

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.totalQueries}</div>
          <div className="stat-label">Total Queries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.resolvedQueries}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.avgResponseTime}</div>
          <div className="stat-label">Avg Response Time (minutes)</div>
        </div>
      </div>

      <div className="card">
        <h3>Query Types Distribution</h3>
        <div className="chart-container">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.queryTypes).map(([type, count]) => (
                <tr key={type}>
                  <td style={{ textTransform: 'capitalize' }}>{type}</td>
                  <td>{count}</td>
                  <td>
                    {analytics.totalQueries > 0
                      ? ((count / analytics.totalQueries) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Status Distribution</h3>
        <div className="chart-container">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                <tr key={status}>
                  <td style={{ textTransform: 'capitalize' }}>{status.replace('-', ' ')}</td>
                  <td>{count}</td>
                  <td>
                    {analytics.totalQueries > 0
                      ? ((count / analytics.totalQueries) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Priority Distribution</h3>
        <div className="chart-container">
          <table className="table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
                <tr key={priority}>
                  <td style={{ textTransform: 'capitalize' }}>{priority}</td>
                  <td>{count}</td>
                  <td>
                    {analytics.totalQueries > 0
                      ? ((count / analytics.totalQueries) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Channel Distribution</h3>
        <div className="chart-container">
          <table className="table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.channelDistribution).map(([channel, count]) => (
                <tr key={channel}>
                  <td style={{ textTransform: 'capitalize' }}>{channel}</td>
                  <td>{count}</td>
                  <td>
                    {analytics.totalQueries > 0
                      ? ((count / analytics.totalQueries) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Average Response Time by Query Type</h3>
        <div className="chart-container">
          <table className="table">
            <thead>
              <tr>
                <th>Query Type</th>
                <th>Avg Response Time (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.responseTimeByTag).map(([tag, time]) => (
                <tr key={tag}>
                  <td style={{ textTransform: 'capitalize' }}>{tag}</td>
                  <td>{Math.round(time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

