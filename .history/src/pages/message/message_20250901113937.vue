<route lang="jsonc">
{
  "layout": "tabbar",
  "needLogin":true,
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "消息通知",
  },
}
</route>

<script lang="ts" setup></script>

<template>
  <view class="container">
    <message-item />
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100%;
  width: 100%;
  padding: 25rpx;
}
</style>
