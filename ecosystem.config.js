module.exports = {
  apps: [{
    script: 'dist/main.js',
    watch: '.',
    env: {
      NODE_ENV: 'development',
      PASSPORT_SESSION_SECRET: 'interview',
      MONGODB_URL: 'mongodb+srv://localhost:20017/interview',
    },
  }],
};
