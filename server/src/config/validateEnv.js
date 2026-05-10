const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'PORT',
  'CLIENT_URL',
];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`\n❌ Missing required environment variables:\n  ${missing.join('\n  ')}\n`);
    console.error('Copy server/.env.example to server/.env and fill in the values.\n');
    process.exit(1);
  }
};

module.exports = { validateEnv };
