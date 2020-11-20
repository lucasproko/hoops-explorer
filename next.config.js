// next.config.js
const withCSS = require('@zeit/next-css');
const compose = require('next-compose')

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')


const withCssConfig = {
  env: {
    GA_KEY: process.env.GA_KEY,
    MEN_CURR_UPDATE: process.env.MEN_CURR_UPDATE,
    WOMEN_CURR_UPDATE: process.env.WOMEN_CURR_UPDATE
  }
};

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return compose([
      [withCSS, withCssConfig],
      {
        webpack: (config, { isServer }) => {
          if (isServer) {
            return {
              ...config,
              entry() {
                return config.entry().then(entry => {
                  return Object.assign({}, entry, {
                    buildLeaderboards: "./src/bin/buildLeaderboards.ts"
                  });
                });
              }
            }
          } else return config;
        }
      }
    ]);
  }

  return withCSS({
    env: {
      GA_KEY: process.env.GA_KEY,
      MEN_CURR_UPDATE: process.env.MEN_CURR_UPDATE,
      WOMEN_CURR_UPDATE: process.env.WOMEN_CURR_UPDATE
    }
  });
}

/*

TODO: needed for GA and stuff to work

module.exports = withCSS({
  env: {
    GA_KEY: process.env.GA_KEY,
    MEN_CURR_UPDATE: process.env.MEN_CURR_UPDATE,
    WOMEN_CURR_UPDATE: process.env.WOMEN_CURR_UPDATE
  }
});

TODO: needed for leaderboard building
TODO: does this break GA?

module.exports = compose([
  [withCSS, withCssConfig],
  {
    webpack: (config, { isServer }) => {
      if (isServer) {
        return {
          ...config,
          entry() {
            return config.entry().then(entry => {
              return Object.assign({}, entry, {
                buildLeaderboards: "./src/bin/buildLeaderboards.ts"
              });
            });
          }
        }
      } else return config;
    }
  }
]);
*/
