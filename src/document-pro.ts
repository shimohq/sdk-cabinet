import ShimoCabinet from './lib/cabinet'

/* tslint:disable-next-line:strict-type-predicates */
if (window.__env == null) {
  window.__env = {}
}
window.__env.channel = 'cloud'

import '../vendor/shimo-jssdk/shimo.sdk.common.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.common.collaboration.min.js'

import '../vendor/shimo-jssdk/shimo.sdk.document-pro.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document-pro.min.css'

ShimoCabinet.globals = {
  common: window.shimo.sdk.common,
  documentPro: window.shimo.documentPro
}

export default ShimoCabinet

module.exports = ShimoCabinet
module.exports.default = ShimoCabinet
