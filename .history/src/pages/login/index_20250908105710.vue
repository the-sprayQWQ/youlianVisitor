<route lang="jsonc" type="home">
{
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTextStyle": "black",
  },
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

// 状态栏高度
const statusBarHeight = ref(0)
onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

async function visitorLogin() {
  uni.showModal({
    title: '提示',
    content: '是否使用访客登录?',
    success: async (res) => {
      if (res.confirm) {
        await userStore.wxLogin()
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index',
          })
        }, 500)
      }
    },
  })
}
function getPhoneNumber(e) {
  console.log('获取手机号事件', e)
}
function adminLogin() {
  uni.navigateTo({ url: '/pages/login/admin' })
}
const tmplIds = [
  'V0U7bx0ALhbBB2gl9aqstWVQWxUauJdm_rrkMl76m3g',

] // 模板 ID
// function jx() {
//   uni.requestSubscribeMessage({
//     tmplIds,
//     success(res) {
//       console.log('订阅结果:', res)
//       const templateId = tmplIds[0]
//       if (res[templateId] === 'accept') {
//         // uni.showToast({
//         //   title: '订阅成功',
//         //   icon: 'success',
//         // })
//       }
//     },
//     fail(err) {
//       console.error('订阅失败', err)
//     },
//   })
// }
</script>

<template>
  <view class="container">
    <view class="custom-navbar" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="navbar-content">
        <text class="navbar-title">登录</text>
      </view>
    </view>

    <view class="content">
      <view class="logo">
        <image
          class="h-full w-full"
          src="/static/images/logo.png"
          mode="aspectFill"
        />
      </view>
      <view class="title">
        欢迎使用友联访客系统
      </view>
      <button class="visitor" open-type="getPhoneNumber" @click="visitorLogin" @getphonenumber="getPhoneNumber">
        <view i-carbon:user-follow class="mr-2 h-19px w-19px" />访客申请
      </button>

      <button class="admin" @click="adminLogin">
        <view i-carbon:locked class="mr-2 h-19px w-19px" />管理员登录
      </button>
      <!-- <button class="mt-2" @click="jx">
        点击有惊喜
      </button> -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #ffffff;
}
// 自定义导航栏
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #f8f8f8;
  .navbar-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .navbar-title {
      font-size: 33rpx;
      color: #000000;
      line-height: 1;
    }
  }
}

.content {
  padding-top: calc(44px + var(--status-bar-height, 0px));
  min-height: calc(100vh - 44px - var(--status-bar-height, 0px));
  padding-left: 40rpx;
  padding-right: 40rpx;
  box-sizing: border-box;
  .logo {
    margin: 0 auto;
    margin-top: 50rpx;
    width: 100rpx;
    height: 100rpx;
  }
  .title {
    margin: 0 auto;
    margin-top: 20rpx;
    font-size: 60rpx;
    font-weight: 700;
    text-align: center;
  }
  .visitor {
    margin-top: 50rpx;
    color: #fff;
    background-color: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-weight: 700;
    border-radius: 8rpx;
    &::after {
      border: none;
    }
  }

  .admin {
    margin-top: 20rpx;
    color: #000;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d1d5db;
    border-radius: 8rpx;
    font-size: 30rpx;
    &::after {
      border: 1px solid #d1d5db;
    }
  }
}
</style>
