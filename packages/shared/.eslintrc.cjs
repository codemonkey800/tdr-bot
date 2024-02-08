const { resolve } = require('path')
const { getEslintConfig } = require('@tdr-bot/eslint-config/utils.cjs')

const tsConfigFile = resolve(__dirname, './tsconfig.json')

module.exports = getEslintConfig({ tsConfigFile })
