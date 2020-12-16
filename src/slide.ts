import ShimoCabinet, { ReadyState } from './lib/cabinet'

import '../vendor/shimo-jssdk/shimo.sdk.common.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.common.collaboration.min.js'

import '../vendor/shimo-jssdk/shimo.sdk.slide.min.js'

ShimoCabinet.globals = {
  common: window.shimo.sdk.common,
  slide: window.shimo.sdk.slide
}

export default ShimoCabinet
export { ReadyState }

module.exports = ShimoCabinet
module.exports.default = ShimoCabinet
