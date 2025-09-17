<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc" type="home">
{
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "管理员登录",
  },
}
</route>

<script lang="ts" setup>
import { useUserStore } from '@/store'

// 添加登录相关的数据
const loginType = ref('account')
const formData = ref({
  username: '',
  password: '',
})
const phoneFormData = ref({
  phone: '',
  password: '',
})
const userStore = useUserStore()

function switchLoginType(type: string) {
  loginType.value = type
  formData.value.username = ''
  formData.value.password = ''
}

async function handleLogin(loginType: string) {
  // 登录逻辑待实现
  console.log('登录', formData.value)
  if (loginType === 'account') {
    console.log('执行了')
    await userStore.login(formData.value)
    if (userStore.roleType === '门卫') {
      uni.switchTab({ url: '/pages/doorKeeperApproval/doorKeeperApproval' })
    }
  }
  else {
    await userStore.phoneLogin(phoneFormData.value)
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index',
      })
    }, 500)
  }
}
</script>

<template>
  <view class="container">
    <view class="content">
      <view class="logo">
        <image
          class="h-full w-full"
          src="/static/images/logo.png"
          mode="aspectFill"
        />
      </view>
      <view class="title">
        友联访客系统
      </view>

      <!-- 新增：登录表单区域 -->
      <view class="login-form">
        <!-- 登录方式切换 -->
        <view class="login-tabs">
          <view
            class="tab-item"
            :class="{ active: loginType === 'account' }"
            @tap="switchLoginType('account')"
          >
            账号登录
          </view>
          <view
            class="tab-item"
            :class="{ active: loginType === 'phone' }"
            @tap="switchLoginType('phone')"
          >
            手机号登录
          </view>
        </view>

        <!-- 输入框 -->
        <view class="input-group">
          <view class="input-wrapper">
            <view class="input-icon" i-carbon-user />
            <input
              v-if="loginType === 'account'"
              v-model="formData.username"
              class="input-field"
              type="text"
              placeholder="请输入账号"
            >
            <input
              v-else
              v-model="phoneFormData.phone"
              class="input-field"
              type="tel"
              placeholder="请输入手机号"
            >
          </view>

          <view class="input-wrapper">
            <view class="input-icon" i-carbon-locked />
            <input
              v-if="loginType === 'account'"
              v-model="formData.password"
              class="input-field"
              type="password"
              password
              placeholder="请输入密码"
            >
            <input
              v-else
              v-model="phoneFormData.password"
              class="input-field"
              type="safe-password"
              password
              placeholder="请输入密码"
            >
          </view>
        </view>

        <!-- 登录按钮 -->
        <button class="login-btn" @tap="handleLogin(loginType)">
          登录
        </button>

        <!-- 版权信息 -->
        <view class="copyright">
          Copyright © 2024 友联访客系统 版权所有
        </view>
      </view>

      <!-- <button @click="jx">
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

.content {
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

  // 新增：登录表单样式
  .login-form {
    margin-top: 60rpx;
    max-width: 520rpx;
    margin-left: auto;
    margin-right: auto;
  }

  .login-tabs {
    display: flex;
    margin-bottom: 40rpx;
    background-color: #fcfcfd;
    border-radius: 12rpx;
    padding: 8rpx;
    position: relative;

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
      color: #666;
      padding: 16rpx 0;
      position: relative;
      border-radius: 10rpx;
      transition: all 0.3s ease;
      z-index: 1;

      &.active {
        color: #1890ff;
        background-color: #fff;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
      }
    }
  }

  .input-group {
    margin-bottom: 40rpx;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 12rpx;
    padding: 0 24rpx;
    margin-bottom: 24rpx;
    border: 1rpx solid #e5e7eb;
    transition: all 0.3s ease;

    &:focus-within {
      border-color: #1890ff;
    }
  }

  .input-icon {
    width: 28rpx;
    height: 28rpx;
    margin-right: 16rpx;
    color: #999;
  }

  .input-field {
    flex: 1;
    padding: 18rpx 0;
    font-size: 28rpx;
    color: #333;
    border: none;
    outline: none;
    background: transparent;

    &::placeholder {
      color: #9ca3af;
    }
  }

  .login-btn {
    width: 100%;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 12rpx;
    padding: 18rpx 0;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 60rpx;

    &::after {
      border: none;
    }

    &:active {
      background: #096dd9;
    }
  }

  .copyright {
    text-align: center;
    font-size: 24rpx;
    color: #999;
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
