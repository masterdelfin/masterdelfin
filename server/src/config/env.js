module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
