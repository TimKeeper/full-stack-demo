import { antfu, GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN } from '@antfu/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

let jsoncPrettierRules, yamlPrettierRules

const defaultFlatConfigComposer = antfu()

const config = (flatConfigComposer = defaultFlatConfigComposer) => {
  return (
    flatConfigComposer
      .renamePlugins({
        // 官方标准化插件名称，被自动修改了，给他改回来
        yaml: 'yml',
        ts: '@typescript-eslint',
      })
      // ignore 文件中移除 lock 文件
      .override(0, config => {
        config.name = 'antfu/gitignores'
        return config
      })
      // ignore 文件中移除 lock 文件
      .override(1, config => {
        config.name = 'antfu/builtin-ignores'
        const whiteList = ['**/package-lock.json', '**/yarn.lock', '**/pnpm-lock.yaml']
        const ignores = config.ignores ?? []
        config.ignores = ignores.filter(item => !whiteList.includes(item))
        return config
      })
      .append({
        name: 'antfu/prettier/setup',
        plugins: {
          prettier: eslintPluginPrettier,
        },
        rules: {
          ...eslintPluginPrettier.configs.recommended.rules,
        },
        ignores: [GLOB_MARKDOWN, GLOB_MARKDOWN_IN_MARKDOWN],
      })
      // 使用 prettier 格式化代码，依赖 eslint-plugin-prettier，Markdown 格式化有 bug
      .append({
        name: 'antfu/prettier/rules',
        rules: {
          ...eslintConfigPrettier.rules,
        },
      })
      .onResolved(configs => {
        configs.forEach(config => {
          if (config.name === 'antfu/builtin-ignores') {
            config.ignores.push('charts/**')
          }
          if (config.name === 'antfu/javascript/rules') {
            // javascript 规则配置
          }
          if (config.name === 'antfu/stylistic/rules') {
            // @stylistic/eslint-plugin 规则配置

            // 禁用插件自带的 @stylistic 格式化（不符预期），使用后面的 eslintConfigPrettier 配置
            config.rules = {}
            // require or disallow an empty line between class members
            // https://eslint.org/docs/rules/lines-between-class-members
            config.rules['style/lines-between-class-members'] = ['error', 'always', { exceptAfterSingleLine: false }]
            return config
          }
          if (config.name === 'antfu/vue/rules') {
            // 在模板中强制组件命名样式的特定大小写为 kebab-case
            // https://eslint.vuejs.org/rules/component-name-in-template-casing
            config.rules['vue/component-name-in-template-casing'] = [
              'error',
              'kebab-case',
              {
                registeredComponentsOnly: false,
              },
            ]
            return config
          }
          if (config.name === 'antfu/jsonc/setup') {
            jsoncPrettierRules = config.plugins.jsonc.configs['flat/prettier'][2].rules
          }
          if (config.name === 'antfu/yaml/setup') {
            yamlPrettierRules = config.plugins.yml.configs['flat/prettier'][2].rules
          }
          if (config.name === 'antfu/prettier/rules') {
            const originRules = config.rules
            config.rules = { ...originRules, ...jsoncPrettierRules, ...yamlPrettierRules }
          }
        })
        return configs
      })
  )
}

export const configer = antfu
export default config
