import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Play } from 'lucide-react';
import api from '../api/axios';

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const processFile = async () => {
    if (!file) return;
    
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');
    
    const formData = new FormData();
    formData.append('dataset', file);
    
    try {
      await api.post('/upload-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
          if (percentCompleted === 100) {
            setStatus('processing');
          }
        }
      });
      
      setStatus('complete');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to process file');
    }
  };

  return (
    <div>
      <h1 className="page-title">Data Ingestion & Processing</h1>

      <div className="grid grid-cols-2">
        <div className="glass-panel">
          <h3>Upload Epidemiological Dataset</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Upload CSV or Excel files containing weekly symptom data, locations, and historical ILI cases.
          </p>

          <div 
            className="upload-area" 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
            />
            <div className="upload-icon">
              <UploadCloud size={32} />
            </div>
            <h4>Click or drag file to this area to upload</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px' }}>
              Support for a single or bulk upload. Strictly adhere to schema.
            </p>
          </div>

          {file && (
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={24} color="var(--accent-blue)" />
                <div>
                  <div style={{ fontWeight: 500 }}>{file.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              {status === 'idle' && (
                <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); processFile(); }}>
                  <Play size={16} /> Process
                </button>
              )}
            </div>
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span>{status === 'uploading' ? 'Uploading dataset...' : 'Running ML Pipeline...'}</span>
                <span>{progress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--panel-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))', transition: 'width 0.2s ease' }}></div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
              <AlertCircle size={24} />
              <div>
                <div style={{ fontWeight: 600 }}>Processing Failed</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>{errorMsg}</div>
              </div>
            </div>
          )}

          {status === 'complete' && (
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--success)' }}>
              <CheckCircle size={24} />
              <div>
                <div style={{ fontWeight: 600 }}>Processing Complete</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>Model predictions updated successfully. Dashboard is live.</div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel">
          <h3>Dataset Schema Requirements</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Ensure your uploaded data matches the following expected format to guarantee accurate model predictions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', borderLeft: '3px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.05)' }}>
              <h4 style={{ marginBottom: '4px', fontSize: '15px' }}>Temporal Features</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>date (YYYY-MM-DD), week_number (1-52), year</p>
            </div>
            
            <div style={{ padding: '12px', borderLeft: '3px solid var(--accent-purple)', background: 'rgba(139, 92, 246, 0.05)' }}>
              <h4 style={{ marginBottom: '4px', fontSize: '15px' }}>Spatial Features</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>state, district, region_code, population_density</p>
            </div>
            
            <div style={{ padding: '12px', borderLeft: '3px solid var(--warning)', background: 'rgba(245, 158, 11, 0.05)' }}>
              <h4 style={{ marginBottom: '4px', fontSize: '15px' }}>Symptom Latent Data</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>fever_count, cough_count, sore_throat_count, shortness_of_breath_count</p>
            </div>

            <div style={{ padding: '12px', borderLeft: '3px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <h4 style={{ marginBottom: '4px', fontSize: '15px' }}>Target Variable (Optional for inference)</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>ili_cases_confirmed (numeric)</p>
            </div>
          </div>
          
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <AlertCircle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p>Missing values will be automatically imputed using historical means. Outliers beyond 3 standard deviations will be capped.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
