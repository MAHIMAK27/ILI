require('dotenv').config();

const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[Fatal Error]: Environment variable ${envVar} is missing.`);
    process.exit(1);
  }
}

module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI
};
