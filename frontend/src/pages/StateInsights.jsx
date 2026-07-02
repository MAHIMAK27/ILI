import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const StateInsights = () => {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disabledMessage, setDisabledMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/state-insights/${selectedState}`);
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setDisabledMessage(err.response.data.error);
        } else {
          console.error("Error fetching state insights", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedState]);

  if (disabledMessage) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ display: 'inline-block', padding: '48px', maxWidth: '600px' }}>
          <Activity size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ marginBottom: '16px' }}>Module Disabled</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{disabledMessage}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            The most recently uploaded dataset does not contain geographical columns. 
            State Insights require regional data to function.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <div style={{ padding: '32px' }}>Loading Insights...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>State-Level Insights</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Deep dive into regional epidemiological data.</p>
        </div>
        <select 
          className="form-control" 
          style={{ width: '200px' }}
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Kerala">Kerala</option>
          <option value="Karnataka">Karnataka</option>
        </select>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '24px' }}>
        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Current Risk Level</h3>
            <div className="metric-value" style={{ color: data.averageRisk > 80 ? 'var(--danger)' : data.averageRisk > 60 ? 'var(--warning)' : 'var(--accent-blue)' }}>
              {data.averageRisk > 80 ? 'High' : data.averageRisk > 60 ? 'Moderate' : 'Low'}
            </div>
            <div className="metric-trend">Risk Score: {data.averageRisk}/100</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Predicted New Cases</h3>
            <div className="metric-value">{data.predictedCases.toLocaleString()}</div>
            <div className="metric-trend trend-up">Next 7 days</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Dominant Symptom</h3>
            <div className="metric-value" style={{ fontSize: '24px' }}>{data.dominantSymptom}</div>
            <div className="metric-trend">Account for most reports</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-purple)' }}>
            <Activity size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h3>Symptom Distribution Over Time</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                />
                <Bar dataKey="fever" stackId="a" fill="var(--danger)" name="Fever" />
                <Bar dataKey="cough" stackId="a" fill="var(--warning)" name="Cough" />
                <Bar dataKey="soreThroat" stackId="a" fill="var(--accent-blue)" name="Sore Throat" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h3>Prediction Breakdown vs Actual</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.predictionVsActual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                />
                <Line type="monotone" dataKey="predicted" stroke="var(--accent-purple)" strokeWidth={3} name="Predicted Cases" />
                <Line type="monotone" dataKey="actual" stroke="var(--success)" strokeDasharray="5 5" strokeWidth={2} name="Actual Cases" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateInsights;
