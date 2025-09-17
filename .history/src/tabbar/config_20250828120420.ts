import type { TabBar } from '@uni-helper/vite-plugin-uni-pages'

/**
 * tabbar 选择的策略，更详细的介绍见 tabbar.md 文件
 * 0: 'NO_TABBAR' `无 tabbar`
 * 1: 'NATIVE_TABBAR'  `完全原生 tabbar`
 * 2: 'CUSTOM_TABBAR_WITH_CACHE' `有缓存自定义 tabbar`
 * 3: 'CUSTOM_TABBAR_WITHOUT_CACHE' `无缓存自定义 tabbar`
 *
 * 温馨提示：本文件的任何代码更改了之后，都需要重新运行，否则 pages.json 不会更新导致配置不生效
 */
export const TABBAR_STRATEGY_MAP = {
  NO_TABBAR: 0,
  NATIVE_TABBAR: 1,
  CUSTOM_TABBAR_WITH_CACHE: 2,
  CUSTOM_TABBAR_WITHOUT_CACHE: 3,
}

// TODO: 1/3. 通过这里切换使用tabbar的策略
// 如果是使用 NO_TABBAR(0)，nativeTabbarList 和 customTabbarList 都不生效(里面的配置不用管)
// 如果是使用 NATIVE_TABBAR(1)，只需要配置 nativeTabbarList，customTabbarList 不生效
// 如果是使用 CUSTOM_TABBAR(2,3)，只需要配置 customTabbarList，nativeTabbarList 不生效
export const selectedTabbarStrategy
  = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE

type NativeTabBarItem = TabBar['list'][number]

// TODO: 2/3. 使用 NATIVE_TABBAR 时，更新下面的 tabbar 配置
// 修改多套tabbar
export const nativeTabbarList: NativeTabBarItem[] = [
  {
    iconPath: 'static/tabbar/home.png',
    selectedIconPath: 'static/tabbar/home-active.png',
    pagePath: 'pages/index/index',
    text: '首页',
  },

  {
    text: '消息',
    pagePath: 'pages/message/message',
    iconPath: 'static/tabbar/message.png',
    selectedIconPath: 'static/tabbar/message-active.png',
  },
  {
    text: '我的',
    pagePath: 'pages/mine/mine',
    iconPath: 'static/tabbar/mine.png',
    selectedIconPath: 'static/tabbar/mine-active.png',
  },
]

export interface CustomTabBarItem {
  text: string
  pagePath: string
  iconType: 'uniUi' | 'uiLib' | 'unocss' | 'iconfont' | 'image' // 不建议用 image 模式，需要配置2张图
  icon: any // 其实是 string 类型，这里是为了避免 ts 报错 (tabbar/index.vue 里面 uni-icons 那行)
  activeIcon?: string // 只有在 image 模式下才需要，传递的是高亮的图片（PS： 不建议用 image 模式）
  badge?: number | 'dot' // badge 显示一个数字或 小红点（样式可以直接在 tabbar/index.vue 里面修改）
  isBulge?: boolean // 是否是中间的鼓包tabbarItem
}
// TODO: 3/3. 使用 CUSTOM_TABBAR(2,3) 时，更新下面的 tabbar 配置
export const customTabbarList: CustomTabBarItem[] = [
  {
    iconType: 'unocss',
    icon:'i-carbon:home'
    pagePath: 'pages/index/index',
    text: '首页',
  },

  {
    text: '消息',
    pagePath: 'pages/message/message',
    iconType: 'unocss',
  },
  {
    text: '我的',
    pagePath: 'pages/mine/mine',
    iconPath: 'static/tabbar/mine.png',
    selectedIconPath: 'static/tabbar/mine-active.png',
  },
  // {
  //   text: '首页',
  //   pagePath: 'pages/index/index',
  //   // 本框架内置了 uniapp 官方UI库 （uni-ui)的图标库
  //   // 使用方式如：<uni-icons type="home" size="30"/>
  //   // 图标列表地址：https://uniapp.dcloud.net.cn/component/uniui/uni-icons.html
  //   iconType: 'uniUi',
  //   icon: 'home',
  //   // badge: 'dot',
  // },
  // {
  //   text: '关于',
  //   pagePath: 'pages/about/about',
  //   // 注意 unocss 图标需要如下处理：（二选一）
  //   // 1）在fg-tabbar.vue页面上引入一下并注释掉（见tabbar/index.vue代码第2行）
  //   // 2）配置到 unocss.config.ts 的 safelist 中
  //   iconType: 'unocss',
  //   icon: 'i-carbon-code',
  //   // badge: 10,
  // },
]

/**
 * 是否启用 tabbar 缓存
 * NATIVE_TABBAR(1) 和 CUSTOM_TABBAR_WITH_CACHE(2) 时，需要tabbar缓存
 */
export const tabbarCacheEnable = [
  TABBAR_STRATEGY_MAP.NATIVE_TABBAR,
  TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
].includes(selectedTabbarStrategy)

/**
 * 是否启用自定义 tabbar
 * CUSTOM_TABBAR(2,3) 时，启用自定义tabbar
 */
export const customTabbarEnable = [
  TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
  TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITHOUT_CACHE,
].includes(selectedTabbarStrategy)
console.log(customTabbarEnable, '12333')

/**
 * 是否需要隐藏原生 tabbar
 * CUSTOM_TABBAR_WITH_CACHE(2) 时，需要隐藏原生tabbar
 */
export const needHideNativeTabbar
  = selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE

export const tabbarList = customTabbarEnable
  ? customTabbarList
  : nativeTabbarList

const _tabbar: TabBar = {
  // 只有微信小程序支持 custom。App 和 H5 不生效
  custom:
    selectedTabbarStrategy === TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
  color: '#8c8c8c',
  selectedColor: '#1677ff',
  backgroundColor: '#F8F8F8',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: tabbarList as unknown as TabBar['list'],
}

// 0和1 需要显示底部的tabbar的各种配置，以利用缓存
export const tabBar = tabbarCacheEnable ? _tabbar : undefined
