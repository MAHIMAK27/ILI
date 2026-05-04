import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const mockTrendData = [
  { week: 'W1', cases: 120, prediction: 140 },
  { week: 'W2', cases: 132, prediction: 150 },
  { week: 'W3', cases: 101, prediction: 130 },
  { week: 'W4', cases: 140, prediction: 170 },
  { week: 'W5', cases: 190, prediction: 210 },
  { week: 'W6', cases: 250, prediction: 280 },
  { week: 'W7', cases: 210, prediction: 240 },
];

const mockRegionData = [
  { name: 'Maharashtra', score: 85 },
  { name: 'Delhi', score: 72 },
  { name: 'Kerala', score: 68 },
  { name: 'Karnataka', score: 54 },
  { name: 'Gujarat', score: 45 },
];

const Dashboard = () => {
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
            <div className="metric-value">12,450</div>
            <div className="metric-trend trend-up"><TrendingUp size={14} /> +15% this week</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
            <Users size={24} />
          </div>
        </div>
        
        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>High Risk Regions</h3>
            <div className="metric-value">4</div>
            <div className="metric-trend trend-up"><TrendingUp size={14} /> +1 from last week</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Avg Prediction Score</h3>
            <div className="metric-value">64.2</div>
            <div className="metric-trend trend-down"><TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> -2.4% overall</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-purple)' }}>
            <Activity size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Model Accuracy</h3>
            <div className="metric-value">94.8%</div>
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
              <AreaChart data={mockTrendData}>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRegionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="score" fill="var(--accent-purple)" radius={[0, 4, 4, 0]} name="Risk Score">
                  {
                    mockRegionData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.score > 80 ? 'var(--danger)' : entry.score > 60 ? 'var(--warning)' : 'var(--accent-blue)'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
