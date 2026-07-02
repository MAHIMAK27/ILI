const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
  try {
    // We need a token. Let's create a user and login first.
    console.log("Registering user...");
    await axios.post('http://127.0.0.1:5000/api/auth/register', {
      email: 'testupload@example.com',
      password: 'password123'
    }).catch(e => { if(e.response && e.response.status !== 400) throw e; }); // Ignore if exists
    
    console.log("Logging in...");
    const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
      email: 'testupload@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log("Token:", token);

    const formData = new FormData();
    formData.append('dataset', fs.createReadStream(path.join(__dirname, '../sample_ili_dataset.csv')));

    console.log("Uploading file...");
    const res = await axios.post('http://127.0.0.1:5000/api/upload-data', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("Response:", res.status, res.data);
  } catch (err) {
    if (err.response) {
      console.error("Error Response:", err.response.status, err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

testUpload();
