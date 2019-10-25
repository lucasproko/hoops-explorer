// next.config.js
const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  env: {
    GA_KEY: process.env.GA_KEY
  }
});
