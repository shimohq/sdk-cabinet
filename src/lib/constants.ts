export const sheetPluginInitOrders = {
  highest: ['ConditionalFormat', 'DataValidation', 'FilterViewport', 'Lock', 'Toolbar', 'MobileSheetTab', 'Collaboration', 'Collaborators'],
  normal: ['Chart', 'Comment', 'ContextMenu', 'Fill', 'FormulaSidebar', 'Shortcut', 'BasicPlugins', 'PivotTable', 'Print', 'HistorySidebarSkeleton', 'MobileToolbar', 'MobileContextmenu']
}

export const sheetPluginList = {
  basicPlugins: 'BasicPlugins',
  chart: 'Chart',
  collaborators: 'Collaborators',
  comment: 'Comment',
  conditionalFormat: 'ConditionalFormat',
  dataValidation: 'DataValidation',
  fill: 'Fill',
  filterViewPort: 'FilterViewport',
  form: 'Form',
  formulaSidebar: 'FormulaSidebar',
  historySidebar: 'HistorySidebarSkeleton',
  lock: 'Lock',
  mobileContextmenu: 'MobileContextmenu',
  mobileToolbar: 'MobileToolbar',
  pivotTable: 'PivotTable',
  print: 'Print',
  shortcut: 'Shortcut',
  toolbar: 'Toolbar',
  contextmenu: 'ContextMenu',
  mobileSheetTab: 'MobileSheetTab'
}

export const sheetPluginListReverse = {
  BasicPlugins: 'basicPlugins',
  Chart: 'chart',
  Collaborators: 'collaborators',
  Comment: 'comment',
  ConditionalFormat: 'conditionalFormat',
  DataValidation: 'dataValidation',
  Fill: 'fill',
  FilterViewport: 'filterViewPort',
  Form: 'form',
  FormulaSidebar: 'formulaSidebar',
  HistorySidebarSkeleton: 'historySidebar',
  Lock: 'lock',
  MobileContextmenu: 'mobileContextmenu',
  MobileToolbar: 'mobileToolbar',
  PivotTable: 'pivotTable',
  Print: 'print',
  Shortcut: 'shortcut',
  Toolbar: 'toolbar',
  ContextMenu: 'contextmenu',
  MobileSheetTab: 'mobileSheetTab'
}

export const documentPluginList = {
  collaborator: 'Collaborator',
  comment: 'Comment',
  'demo-screen': 'DemoScreen',
  gallery: 'Gallery',
  history: 'History',
  mention: 'Mention',
  mobile: 'Mobile',
  revision: 'Revision',
  'table-of-content': 'TableOfContent',
  uploader: 'Uploader',
  toolbar: 'Toolbar'
}

export const documentPluginListReverse = {
  Collaborator: 'collaborator',
  Comment: 'comment',
  DemoScreen: 'demo-screen',
  Gallery: 'gallery',
  History: 'history',
  Mention: 'mention',
  Mobile: 'mobile',
  Revision: 'revision',
  TableOfContent: 'table-of-content',
  Uploader: 'uploader',
  Toolbar: 'toolbar'
}

export const loadedResources: { [key: string]: boolean } = {}

export enum ReadyState {
  editorReady,
  pluginReady,
  allReady
}

export enum events {
  readyState = 'readyState'
}
