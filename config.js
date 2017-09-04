module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'super_secret',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/snippet'
}
