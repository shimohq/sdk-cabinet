import ShimoCabinet from './lib/cabinet'

import '../vendor/shimo-jssdk/shimo.sdk.common.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.common.collaboration.min.js'

import '../vendor/shimo-jssdk/shimo.sdk.sheet.editor.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.contextmenu.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.lock.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.chart.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.fill.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.print.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.collaboration.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.filterViewport.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.sheetmenu.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.collaborators.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.form.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.shortcut.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.comment.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.formulaSidebar.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.toolbar.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.conditionalFormat.min.js'
import '../vendor/shimo-jssdk/shimo.sdk.sheet.plugins.historySidebar.min.js'

ShimoCabinet.globals = {
  common: window.shimo.sdk.common,
  sheet: window.shimo.sdk.sheet
}

export default ShimoCabinet

module.exports = ShimoCabinet
module.exports.default = ShimoCabinet
