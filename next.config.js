// next.config.js

const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const baseConfig = {
  env: {
    GA_KEY: process.env.GA_KEY,
    MEN_CURR_UPDATE: process.env.MEN_CURR_UPDATE,
    WOMEN_CURR_UPDATE: process.env.WOMEN_CURR_UPDATE,
  },
};

module.exports = (phase, { defaultConfig }) => {
  // Start with the default configuration
  const phaseConfig = {
    ...baseConfig,
  };
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Customize the Webpack config during development
    phaseConfig.webpack = (config, { isServer }) => {
      if (typeof window === "undefined") {
        return {
          ...config,
          entry() {
            return config.entry().then((entry) => {
              return Object.assign({}, entry, {
                //buildLeaderboards: "./src/bin/buildLeaderboards.ts",
              });
            });
          },
        };
      }
      return config;
    };
  }

  return phaseConfig;
};
