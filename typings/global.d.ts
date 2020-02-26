import * as ICollaboration from './common/collaboration'

import * as ISheetEditor from './sheet/editor'
import * as IChart from './sheet/plugins/chart'
import * as ICollaborators from './sheet/plugins/collaborators'
import * as IComment from './sheet/plugins/comment'
import * as ISheetContextmenu from './sheet/plugins/contextmenu'
import * as IFill from './sheet/plugins/fill'
import * as IFilterViewport from './sheet/plugins/filterViewport'
import * as IFormulaSidebar from './sheet/plugins/formulaSidebar'
import * as IHistorySidebarSkeleton from './sheet/plugins/historySidebarSkeleton'
import * as IShortcut from './sheet/plugins/shortcut'
import * as IToolbar from './sheet/plugins/toolbar'
import * as ILock from './sheet/plugins/lock'
import * as ISheetPrint from './sheet/plugins/print'

import * as IDocEditor from './document/editor'
import * as IDocGallery from './document/plugins/gallery'
import * as IDocHistory from './document/plugins/history'
import * as IDocTableOfContent from './document/plugins/tableOfContent'
import * as IDocToolbar from './document/plugins/toolbar'
import * as IDocCollaborator from './document/plugins/collaborator'
import * as IDocComment from './document/plugins/comment'
import * as IDocDemoScreen from './document/plugins/demoScreen'
import * as IDocUploader from './document/plugins/uploader'
import * as IDocShortcut from './document/plugins/shortcut'

import * as ISlideEditor from './slide/editor'
import * as ISlideLayouts from './slide/plugins/layouts'

import * as IDocumentProEditor from './document-pro/editor'

interface IUser {
  avatar: string
  id: number
  isVerified: boolean
  name: string
  permission?: ILock.PermissionConfig
}

interface IFile {
  guid: string
  head: number
  content: string
  type: string
  config: {
    entrypoint: string,
    token: string,
    uploadMaxFileSize: number,
    uploadOrigin: string,
    uploadServer: string,
    uploadToken: string
  }
  userId: number
  permissions: {
    editable: boolean,
    readable: boolean,
    commentable: boolean
  }
}

declare global {
  namespace ShimoSDK {
    export type File = IFile
    export type User = IUser
    namespace Common {
      export type Collaboration = ICollaboration.default
      export type CollaborationOptions = ICollaboration.CollaborationOptions
      export type CollaborationEvents = ICollaboration.Events
      export type CollaborationStatus = ICollaboration.Status
    }

    namespace Sheet {
      export type BasePluginOptions = ISheetEditor.BasePluginOptions
      export type Collaborators = ICollaborators.default
      export type CollaboratorsOptions = ICollaborators.CollaboratorsOptions
      export type Editor = ISheetEditor.default
      export type EditorOptions = ISheetEditor.EditorOptions
      export type EditorRenderOptions = ISheetEditor.EditorRenderOptions
      export type Chart = IChart.default
      export type ChartOptions = IChart.ChartOptions
      export type Comment = IComment.default
      export type CommentOptions = IComment.CommentOptions
      export type SheetContextmenu = ISheetContextmenu.default
      export type SheetContextmenuOptions = ISheetContextmenu.SheetContextmenuOptions
      export type Fill = IFill.default
      export type FillOptions = IFill.FillOptions
      export type FilterViewport = IFilterViewport.default
      export type FilterViewportOptions = IFilterViewport.FilterViewportOptions
      export type FormulaSidebar = IFormulaSidebar.default
      export type FormulaSidebarOptions = IFormulaSidebar.FormulaSidebarOptions
      export type HistorySidebarSkeleton = IHistorySidebarSkeleton.default
      export type HistorySidebarSkeletonOptions = IHistorySidebarSkeleton.HistorySidebarSkeletonOptions
      export import Plugins = ISheetEditor.Plugins
      export type Shortcut = IShortcut.default
      export type ShortcutOptions = IShortcut.ShortcutOptions
      export type Toolbar = IToolbar.default
      export type ToolbarOptions = IToolbar.ToolbarOptions
      export type Lock = ILock.default
      export type LockOptions = ILock.LockOptions
      export type Print = ISheetPrint.default
    }

    namespace Document {
      export type BasePluginOptions = IDocEditor.BasePluginOptions
      export type Editor = IDocEditor.default
      export type EditorOptions = IDocEditor.EditorOptions
      export type Gallery = IDocGallery.default
      export type GalleryOptions = IDocGallery.GalleryOptions
      export type History = IDocHistory.default
      export type HistoryOptions = IDocHistory.HistoryOptions
      export type TableOfContent = IDocTableOfContent.default
      export type TableOfContentOptions = IDocTableOfContent.TableOfContentOptions
      export type ToolbarOptions = IDocToolbar.ToolbarOptions
      export type Collaborator = IDocCollaborator.default
      export type CollaboratorOptions = IDocCollaborator.CollaboratorOptions
      export type Comment = IDocComment.default
      export type CommentOptions = IDocComment.CommentOptions
      export type DemoScreen = IDocDemoScreen.default
      export type DemoScreenOptions = IDocDemoScreen.DemoScreenOptions
      export type Uploader = IDocUploader.default
      export type UploaderOptions = IDocUploader.UploaderOptions
      export type UploaderEvents = IDocUploader.Events
      export type Shortcut = IDocShortcut.default
      export type ShortcutOptions = IDocShortcut.ShortcutOptions
      export import Plugins = IDocEditor.Plugins
    }

    namespace Slide {
      export type Editor = ISlideEditor.Editor
      export type EditorOptions = ISlideEditor.EditorOptions

      export import Layouts = ISlideLayouts.Layouts
      export type LayoutsOptions = ISlideLayouts.LayoutsOptions
    }

    namespace DocumentPro {
      export import Editor = IDocumentProEditor.Editor
      export import EditorOptions = IDocumentProEditor.EditorOptions
    }
  }
}

declare global {
  interface Window {
    __env: { [key: string]: any }
    shimo: { [key: string]: any }
  }
}
