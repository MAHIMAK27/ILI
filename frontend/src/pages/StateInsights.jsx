import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Users } from 'lucide-react';
import { useState } from 'react';

const mockSymptomData = [
  { week: 'W1', fever: 400, cough: 240, soreThroat: 240 },
  { week: 'W2', fever: 300, cough: 139, soreThroat: 221 },
  { week: 'W3', fever: 200, cough: 980, soreThroat: 229 },
  { week: 'W4', fever: 278, cough: 390, soreThroat: 200 },
  { week: 'W5', fever: 189, cough: 480, soreThroat: 218 },
  { week: 'W6', fever: 239, cough: 380, soreThroat: 250 },
  { week: 'W7', fever: 349, cough: 430, soreThroat: 210 },
];

const StateInsights = () => {
  const [selectedState, setSelectedState] = useState('Maharashtra');

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
            <div className="metric-value" style={{ color: 'var(--danger)' }}>High</div>
            <div className="metric-trend">Risk Score: 85/100</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Predicted New Cases</h3>
            <div className="metric-value">2,450</div>
            <div className="metric-trend trend-up">Next 7 days</div>
          </div>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-info">
            <h3>Dominant Symptom</h3>
            <div className="metric-value" style={{ fontSize: '24px' }}>Fever & Cough</div>
            <div className="metric-trend">Account for 72% of reports</div>
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
              <BarChart data={mockSymptomData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <LineChart data={mockSymptomData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                />
                <Line type="monotone" dataKey="fever" stroke="var(--accent-purple)" strokeWidth={3} name="Predicted Cases" />
                <Line type="monotone" dataKey="cough" stroke="var(--success)" strokeDasharray="5 5" strokeWidth={2} name="Actual Cases" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateInsights;
