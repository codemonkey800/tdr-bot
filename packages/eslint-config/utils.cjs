function getEslintConfig({ tsConfigFile }) {
  return {
    root: true,
    extends: ['@tdr-bot'],

    parserOptions: {
      debugLevel: process.env.ESLINT_DEBUG === 'true',
      EXPERIMENTAL_useProjectService: true,
      project: tsConfigFile,
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [tsConfigFile],
        },
      },
    },
  }
}

module.exports = {
  getEslintConfig,
}
