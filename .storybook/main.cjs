module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@luigiminardim/storybook-addon-globals-controls",
    "@storybook/addon-a11y",
  ],
  webpackFinal: async (config, { configType }) => {
    config.devtool = 'source-map'
    return config;
  },
  framework: "@storybook/react",
};
