const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testAll() {
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
      console.log("Dashboard Metrics:", dash.data.metrics);
      console.log("Dashboard Trend Length:", dash.data.trendData.length);
      console.log("Dashboard Region Length:", dash.data.regionData.length);

      const map = await axios.get('http://localhost:5000/api/regional-map', { headers: authHeaders });
      console.log("Regional Map Entries:", map.data.length);
      if (map.data.length > 0) console.log("Sample Map Entry:", map.data[0].state);
    };

    await checkData("Before Uploading");

    for (let i = 1; i <= 3; i++) {
      const formData = new FormData();
      formData.append('dataset', fs.createReadStream(path.join(__dirname, `test_dataset_${i}.csv`)));
      console.log(`\nUploading dataset ${i}...`);
      await axios.post('http://localhost:5000/api/upload-data', formData, {
        headers: { ...formData.getHeaders(), ...authHeaders }
      });
      await checkData(`After Dataset ${i}`);
      
      // Let's also check state insights for a state that was just uploaded
      let stateToTest = i === 1 ? 'Delhi' : i === 2 ? 'Kerala' : 'Gujarat';
      const insights = await axios.get(`http://localhost:5000/api/state-insights/${stateToTest}`, { headers: authHeaders });
      console.log(`State Insights for ${stateToTest}: Predicted=${insights.data.predictedCases}, Dominant=${insights.data.dominantSymptom}`);
    }

  } catch (err) {
    if (err.response) {
      console.error("Error Response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

testAll();
