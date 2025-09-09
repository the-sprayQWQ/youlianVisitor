<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "layout": "tabbar",
  "needLogin": true, // 是否需要登录"
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "审核",
  },
}
</route>

<script lang="ts" setup></script>

<template>
  <view>审核页面</view>
</template>

<style lang="scss" scoped></style>
