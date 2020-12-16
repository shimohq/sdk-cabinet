import ShimoCabinet, { ReadyState } from './lib/cabinet'

import '../vendor/shimo-jssdk/shimo.sdk.common.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.common.collaboration.min.js'

import '../vendor/shimo-jssdk/shimo.sdk.document.editor.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.gallery.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.table-of-content.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.collaborator.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.history.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.uploader.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.comment.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.mention.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.demo-screen.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.revision.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.document.plugins.mobile.min.js'

ShimoCabinet.globals = {
  common: window.shimo.sdk.common,
  document: window.shimo.sdk.document
}

export default ShimoCabinet
export { ReadyState }

module.exports = ShimoCabinet
module.exports.default = ShimoCabinet
