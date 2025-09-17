<route lang="jsonc" type="home">
{
  "layout": "tabbar",
  "needLogin": true, // 是否需要登录
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "扫码登记",
  },
}
</route>

<script lang="ts" setup>
onShow(){
    uni.scanCode({
  success: (res) => {
    console.log(res)
  },
})
}
</script>

<template>
  <view />
</template>

<style lang="scss" scoped></style>
