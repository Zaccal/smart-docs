import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  isInEditor: false,
  rules: {
    'max-len': ['error', { code: 300 }],
  },
  ignores: ['README.md', 'routeThree.gen.ts'],
  overrides: {
    react: {
      'style/jsx-max-props-per-line': [1, { maximum: 3 }],
    },
  },
})
