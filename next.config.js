// next.config.js
const withCSS = require('@zeit/next-css');
module.exports = withCSS({
  env: {
    GA_KEY: process.env.GA_KEY,
    MEN_CURR_UPDATE: process.env.MEN_CURR_UPDATE,
    WOMEN_CURR_UPDATE: process.env.WOMEN_CURR_UPDATE
  }
});
