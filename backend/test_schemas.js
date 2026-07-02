const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testSchemas() {
  try {
    console.log("Logging in...");
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@ili.com',
      password: 'Password123!'
    });
    const token = loginRes.data.token;
    const authHeaders = { 'Authorization': `Bearer ${token}` };

    const checkData = async (label) => {
      console.log(`\n--- Fetching Data [${label}] ---`);
      const dash = await axios.get('http://localhost:5000/api/dashboard', { headers: authHeaders });
      console.log(`Dataset Type Active: ${dash.data.datasetType}`);
      console.log("Dashboard Trend Length:", dash.data.trendData.length);

      try {
        const map = await axios.get('http://localhost:5000/api/regional-map', { headers: authHeaders });
        console.log("Regional Map Entries:", map.data.length);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log("Regional Map: Disabled (400)");
        } else {
          throw err;
        }
      }

      try {
        const insights = await axios.get(`http://localhost:5000/api/state-insights/Delhi`, { headers: authHeaders });
        console.log(`State Insights for Delhi: Predicted=${insights.data.predictedCases}`);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log("State Insights: Disabled (400)");
        } else if (err.response && err.response.status === 404) {
           console.log("State Insights: No data for Delhi (404)");
        } else {
          throw err;
        }
      }
    };

    // 1. Upload Geographic Dataset
    let formData = new FormData();
    formData.append('dataset', fs.createReadStream(path.join(__dirname, 'geographic_dataset.csv')));
    console.log(`\nUploading Geographic Dataset...`);
    let res = await axios.post('http://localhost:5000/api/upload-data', formData, {
      headers: { ...formData.getHeaders(), ...authHeaders }
    });
    console.log("Upload Response Type:", res.data.datasetType);
    await checkData('After Geographic Dataset Upload');

    // 2. Upload Trend Dataset
    formData = new FormData();
    formData.append('dataset', fs.createReadStream(path.join(__dirname, 'trend_dataset.csv')));
    console.log(`\nUploading Trend Dataset...`);
    res = await axios.post('http://localhost:5000/api/upload-data', formData, {
      headers: { ...formData.getHeaders(), ...authHeaders }
    });
    console.log("Upload Response Type:", res.data.datasetType);
    await checkData('After Trend Dataset Upload');

  } catch (err) {
    if (err.response) {
      console.error("Error Response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

testSchemas();
