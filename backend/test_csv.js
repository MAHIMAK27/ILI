const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const parseNum = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

async function test() {
  console.log("Start");
  const results = [];
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, 'sample_ili_dataset.csv'))
        .pipe(csv())
        .on('data', (data) => {
          console.log("Data:", data.date);
          results.push(data);
        })
        .on('end', () => {
          console.log("End");
          resolve();
        })
        .on('error', (err) => {
          console.log("Error", err);
          reject(err);
        });
    });
    console.log("Done", results.length);
  } catch (e) {
    console.log("Caught:", e);
  }
}
test();
