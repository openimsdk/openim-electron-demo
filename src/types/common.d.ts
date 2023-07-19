export interface ChildWindowOptions {
  /**
   * Window's width in pixels. Default is `800`.
   */
  width?: number;
  /**
   * Window's height in pixels. Default is `600`.
   */
  height?: number;
  /**
   * (**required** if y is used) Window's left offset from screen. Default is to
   * center the window.
   */
  x?: number;
  /**
   * (**required** if x is used) Window's top offset from screen. Default is to
   * center the window.
   */
  y?: number;
  /**
   * The `width` and `height` would be used as web page's size, which means the
   * actual window's size will include window frame's size and be slightly larger.
   * Default is `false`.
   */
  useContentSize?: boolean;
  /**
   * Show window in the center of the screen. Default is `false`.
   */
  center?: boolean;
  /**
   * Window's minimum width. Default is `0`.
   */
  minWidth?: number;
  /**
   * Window's minimum height. Default is `0`.
   */
  minHeight?: number;
  /**
   * Window's maximum width. Default is no limit.
   */
  maxWidth?: number;
  /**
   * Window's maximum height. Default is no limit.
   */
  maxHeight?: number;
  /**
   * Whether window is resizable. Default is `true`.
   */
  resizable?: boolean;
  /**
   * Whether window is movable. This is not implemented on Linux. Default is `true`.
   *
   * @platform darwin,win32
   */
  movable?: boolean;
  /**
   * Whether window is minimizable. This is not implemented on Linux. Default is
   * `true`.
   *
   * @platform darwin,win32
   */
  minimizable?: boolean;
  /**
   * Whether window is maximizable. This is not implemented on Linux. Default is
   * `true`.
   *
   * @platform darwin,win32
   */
  maximizable?: boolean;
  /**
   * Whether window is closable. This is not implemented on Linux. Default is `true`.
   *
   * @platform darwin,win32
   */
  closable?: boolean;
  /**
   * Whether the window can be focused. Default is `true`. On Windows setting
   * `focusable: false` also implies setting `skipTaskbar: true`. On Linux setting
   * `focusable: false` makes the window stop interacting with wm, so the window will
   * always stay on top in all workspaces.
   */
  focusable?: boolean;
  /**
   * Whether the window should always stay on top of other windows. Default is
   * `false`.
   */
  alwaysOnTop?: boolean;
  /**
   * Whether the window should show in fullscreen. When explicitly set to `false` the
   * fullscreen button will be hidden or disabled on macOS. Default is `false`.
   */
  fullscreen?: boolean;
  /**
   * Whether the window can be put into fullscreen mode. On macOS, also whether the
   * maximize/zoom button should toggle full screen mode or maximize window. Default
   * is `true`.
   */
  fullscreenable?: boolean;
  /**
   * Use pre-Lion fullscreen on macOS. Default is `false`.
   *
   * @platform darwin
   */
  simpleFullscreen?: boolean;
  /**
   * Whether to show the window in taskbar. Default is `false`.
   *
   * @platform darwin,win32
   */
  skipTaskbar?: boolean;
  /**
   * Whether window should be hidden when the user toggles into mission control.
   *
   * @platform darwin
   */
  hiddenInMissionControl?: boolean;
  /**
   * Whether the window is in kiosk mode. Default is `false`.
   */
  kiosk?: boolean;
  /**
   * Default window title. Default is `"Electron"`. If the HTML tag `<title>` is
   * defined in the HTML file loaded by `loadURL()`, this property will be ignored.
   */
  title?: string;
  /**
   * Whether window should be shown when created. Default is `true`.
   */
  show?: boolean;
  /**
   * Whether the renderer should be active when `show` is `false` and it has just
   * been created.  In order for `document.visibilityState` to work correctly on
   * first load with `show: false` you should set this to `false`.  Setting this to
   * `false` will cause the `ready-to-show` event to not fire.  Default is `true`.
   */
  paintWhenInitiallyHidden?: boolean;
  /**
   * Specify `false` to create a frameless window. Default is `true`.
   */
  frame?: boolean;
  /**
   * Whether this is a modal window. This only works when the window is a child
   * window. Default is `false`.
   */
  modal?: boolean;
  /**
   * Whether clicking an inactive window will also click through to the web contents.
   * Default is `false` on macOS. This option is not configurable on other platforms.
   *
   * @platform darwin
   */
  acceptFirstMouse?: boolean;
  /**
   * Whether to hide cursor when typing. Default is `false`.
   */
  disableAutoHideCursor?: boolean;
  /**
   * Auto hide the menu bar unless the `Alt` key is pressed. Default is `false`.
   */
  autoHideMenuBar?: boolean;
  /**
   * Enable the window to be resized larger than screen. Only relevant for macOS, as
   * other OSes allow larger-than-screen windows by default. Default is `false`.
   *
   * @platform darwin
   */
  enableLargerThanScreen?: boolean;
  /**
   * The window's background color in Hex, RGB, RGBA, HSL, HSLA or named CSS color
   * format. Alpha in #AARRGGBB format is supported if `transparent` is set to
   * `true`. Default is `#FFF` (white). See win.setBackgroundColor for more
   * information.
   */
  backgroundColor?: string;
  /**
   * Whether window should have a shadow. Default is `true`.
   */
  hasShadow?: boolean;
  /**
   * Set the initial opacity of the window, between 0.0 (fully transparent) and 1.0
   * (fully opaque). This is only implemented on Windows and macOS.
   *
   * @platform darwin,win32
   */
  opacity?: number;
  /**
   * Forces using dark theme for the window, only works on some GTK+3 desktop
   * environments. Default is `false`.
   */
  darkTheme?: boolean;
  /**
   * Makes the window transparent. Default is `false`. On Windows, does not work
   * unless the window is frameless.
   */
  transparent?: boolean;
  /**
   * The type of window, default is normal window. See more about this below.
   */
  type?: string;
  /**
   * Specify how the material appearance should reflect window activity state on
   * macOS. Must be used with the `vibrancy` property. Possible values are:
   *
   * @platform darwin
   */
  visualEffectState?: "followWindow" | "active" | "inactive";
  /**
   * The style of window title bar. Default is `default`. Possible values are:
   *
   * @platform darwin,win32
   */
  titleBarStyle?: "default" | "hidden" | "hiddenInset" | "customButtonsOnHover";
  /**
   * Set a custom position for the traffic light buttons in frameless windows.
   *
   * @platform darwin
   */
  trafficLightPosition?: Point;
  /**
   * Whether frameless window should have rounded corners on macOS. Default is
   * `true`. Setting this property to `false` will prevent the window from being
   * fullscreenable.
   *
   * @platform darwin
   */
  roundedCorners?: boolean;
  /**
   * Shows the title in the title bar in full screen mode on macOS for `hiddenInset`
   * titleBarStyle. Default is `false`.
   *
   * @deprecated
   * @platform darwin
   */
  fullscreenWindowTitle?: boolean;
  /**
   * Use `WS_THICKFRAME` style for frameless windows on Windows, which adds standard
   * window frame. Setting it to `false` will remove window shadow and window
   * animations. Default is `true`.
   */
  thickFrame?: boolean;
  /**
   * Add a type of vibrancy effect to the window, only on macOS. Can be
   * `appearance-based`, `light`, `dark`, `titlebar`, `selection`, `menu`, `popover`,
   * `sidebar`, `medium-light`, `ultra-dark`, `header`, `sheet`, `window`, `hud`,
   * `fullscreen-ui`, `tooltip`, `content`, `under-window`, or `under-page`. Please
   * note that `appearance-based`, `light`, `dark`, `medium-light`, and `ultra-dark`
   * are deprecated and have been removed in macOS Catalina (10.15).
   *
   * @platform darwin
   */
  vibrancy?:
    | "appearance-based"
    | "light"
    | "dark"
    | "titlebar"
    | "selection"
    | "menu"
    | "popover"
    | "sidebar"
    | "medium-light"
    | "ultra-dark"
    | "header"
    | "sheet"
    | "window"
    | "hud"
    | "fullscreen-ui"
    | "tooltip"
    | "content"
    | "under-window"
    | "under-page";
  /**
   * Controls the behavior on macOS when option-clicking the green stoplight button
   * on the toolbar or by clicking the Window > Zoom menu item. If `true`, the window
   * will grow to the preferred width of the web page when zoomed, `false` will cause
   * it to zoom to the width of the screen. This will also affect the behavior when
   * calling `maximize()` directly. Default is `false`.
   *
   * @platform darwin
   */
  zoomToPageWidth?: boolean;
  /**
   * Tab group name, allows opening the window as a native tab. Windows with the same
   * tabbing identifier will be grouped together. This also adds a native new tab
   * button to your window's tab bar and allows your `app` and window to receive the
   * `new-window-for-tab` event.
   *
   * @platform darwin
   */
  tabbingIdentifier?: string;
}
