module.exports = {
  root: true,
  extends: ['peopledoc/ember'],
  rules: {},
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['tests/fixtures/meshs'],
  overrides: [
    {
      files: ['**/*.ts'],
      plugins: [
        '@typescript-eslint'
      ],

      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-duplicate-imports': 'off'
      }
    },
    {
      files: ['**.d.ts'],
      rules: {
        'ember-suave/no-const-outside-module-scope': 'off'
      }
    }
  ]
}
