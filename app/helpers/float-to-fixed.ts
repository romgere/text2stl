import { helper } from '@ember/component/helper'

export function floatToFixed([value, count = 2]: [any, number]) {
  return Number.parseFloat(value).toFixed(count)
}

export default helper(floatToFixed)
