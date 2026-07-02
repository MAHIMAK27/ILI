const fs = require('fs');

const geographicData = `date,state,district,region_code,fever_count,cough_count,sore_throat_count,shortness_of_breath_count,population_density,ili_cases_confirmed
2026-06-01,Delhi,Central,DL01,150,100,50,10,11000,5
2026-06-02,Delhi,Central,DL01,200,120,60,15,11000,8
2026-06-03,Maharashtra,Mumbai,MH01,300,200,100,20,20000,10
2026-06-01,Kerala,Kochi,KL01,50,30,10,5,1500,2
2026-06-02,Kerala,Kochi,KL01,80,40,15,8,1500,4
`;

const trendData = `date,fever_count,cough_count,sore_throat_count,shortness_of_breath_count,population_density,ili_cases_confirmed
2026-07-01,100,90,40,10,4000,5
2026-07-02,400,300,150,50,5000,20
2026-07-03,450,320,180,60,5000,25
2026-07-04,200,150,80,20,1000,12
2026-07-05,220,160,90,25,1000,15
`;

fs.writeFileSync('geographic_dataset.csv', geographicData);
fs.writeFileSync('trend_dataset.csv', trendData);
console.log("Created geographic_dataset.csv and trend_dataset.csv.");
