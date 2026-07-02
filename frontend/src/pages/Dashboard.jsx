import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../api/axios';



const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderColor: 'var(--accent-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading Dashboard...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '32px' }}>
          <AlertTriangle size={48} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
          <h3>Error Loading Dashboard</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.metrics) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No data available. Please upload a dataset first.</p>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Command Center Overview</h1>
        <button className="btn btn-primary">Generate Report</button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4">
        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Total Active Cases</h3>
            <div className="metric-value">{metrics.totalCases?.toLocaleString() || 0}</div>
            <div className="metric-trend trend-up"><TrendingUp size={14} /> +15% this week</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
            <Users size={24} />
          </div>
        </div>
        
        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>High Risk Regions</h3>
            <div className="metric-value">{metrics.highRiskRegions || 0}</div>
            <div className="metric-trend trend-up"><TrendingUp size={14} /> +1 from last week</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Avg Prediction Score</h3>
            <div className="metric-value">{metrics.avgPredictionScore || 0}</div>
            <div className="metric-trend trend-down"><TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> -2.4% overall</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-purple)' }}>
            <Activity size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Model Accuracy</h3>
            <div className="metric-value">{metrics.modelAccuracy || 0}%</div>
            <div className="metric-trend" style={{ color: 'var(--text-secondary)' }}>XGBoost Active</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2" style={{ marginTop: '24px' }}>
        <div className="glass-panel">
          <h3>ILI Cases Trend & Prediction</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData || []}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="cases" stroke="var(--accent-blue)" fillOpacity={1} fill="url(#colorCases)" name="Actual Cases" />
                <Area type="monotone" dataKey="prediction" stroke="var(--danger)" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" name="Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h3>Top Risk Regions (Prediction Score)</h3>
          <div className="chart-container">
            {data.datasetType === 'Trend Dataset' ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <Activity size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p>Regional data unavailable in Trend Datasets.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.regionData || []} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="score" fill="var(--accent-purple)" radius={[0, 4, 4, 0]} name="Risk Score">
                    {
                      (data.regionData || []).map((entry, index) => (
                        <cell key={`cell-${index}`} fill={entry.score > 80 ? 'var(--danger)' : entry.score > 60 ? 'var(--warning)' : 'var(--accent-blue)'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
