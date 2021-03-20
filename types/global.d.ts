// Types for compiled templates
declare module 'text2stl/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile'
  const tmpl: TemplateFactory
  export default tmpl
}
