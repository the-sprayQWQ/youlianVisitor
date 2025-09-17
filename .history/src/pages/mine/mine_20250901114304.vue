<route lang="jsonc">
{
  "layout": "tabbar",
  "needLogin": true, // 是否需要登录
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "我的",
  },
}
</route>

<script lang="ts" setup>
import { useUserStore } from '@/store'

const userStore = useUserStore()

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '是否确认退出登录？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息
        userStore.logout()

        uni.showToast({
          title: '已退出登录',
          icon: 'success',
        })

        // 跳转到登录页
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/index',
          })
        }, 1500)
      }
    },
  })
}

// 处理头像加载错误
function handleAvatarError() {
  console.log('头像加载失败，使用默认头像')
}
</script>

<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="avatar-container">
          <image
            class="avatar"
            :src="userStore.userInfo.avatar || '/static/images/default-avatar.png'"
            mode="aspectFill"
            @error="handleAvatarError"
          />
        </view>
        <view class="user-details">
          <text class="username">{{ userStore.userInfo.username || '访客用户' }}</text>
          <text class="user-id">ID: {{ userStore.userInfo.openId || userStore.userInfo.id || '--' }}</text>
        </view>
      </view>
      <view class="login-status">
        <view class="status-badge online">
          已登录
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <!-- <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @click="handleMenuClick('appointments')">
          <view class="menu-icon">
            <view i-carbon:calendar class="icon" />
          </view>
          <text class="menu-text">预约记录</text>
          <view class="menu-arrow">
            <view i-carbon:chevron-right class="arrow" />
          </view>
        </view>

        <view class="menu-item" @click="handleMenuClick('applications')">
          <view class="menu-icon">
            <view i-carbon:document class="icon" />
          </view>
          <text class="menu-text">申请记录</text>
          <view class="menu-arrow">
            <view i-carbon:chevron-right class="arrow" />
          </view>
        </view>

        <view class="menu-item" @click="handleMenuClick('settings')">
          <view class="menu-icon">
            <view i-carbon:settings class="icon" />
          </view>
          <text class="menu-text">设置</text>
          <view class="menu-arrow">
            <view i-carbon:chevron-right class="arrow" />
          </view>
        </view>
      </view>
    </view> -->

    <!-- 其他功能 -->
    <!-- <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @click="handleMenuClick('help')">
          <view class="menu-icon">
            <view i-carbon:help class="icon" />
          </view>
          <text class="menu-text">帮助与反馈</text>
          <view class="menu-arrow">
            <view i-carbon:chevron-right class="arrow" />
          </view>
        </view>

        <view class="menu-item" @click="handleMenuClick('about')">
          <view class="menu-icon">
            <view i-carbon:information class="icon" />
          </view>
          <text class="menu-text">关于我们</text>
          <view class="menu-arrow">
            <view i-carbon:chevron-right class="arrow" />
          </view>
        </view>
      </view>
    </view> -->

    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        <view i-carbon:logout class="logout-icon" />
        <text class="logout-text">退出登录</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 20rpx;
}

// 用户信息卡片
.user-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-container {
  margin-right: 32rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #f0f0f0;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12rpx;
}

.user-id {
  font-size: 24rpx;
  color: #999999;
}

.login-status {
  .status-badge {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 22rpx;

    &.online {
      background-color: #f6ffed;
      color: #52c41a;
      border: 1rpx solid #b7eb8f;
    }
  }
}

// 菜单部分
.menu-section {
  margin-bottom: 32rpx;
}

.menu-group {
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f8f8f8;
  }
}

.menu-icon {
  margin-right: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;

  .icon {
    width: 40rpx;
    height: 40rpx;
    color: #666666;
  }
}

.menu-text {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
}

.menu-arrow {
  display: flex;
  align-items: center;
  justify-content: center;

  .arrow {
    width: 28rpx;
    height: 28rpx;
    color: #cccccc;
  }
}

// 退出登录部分
.logout-section {
  margin-top: 40rpx;
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  background-color: #ffffff;
  border: 2rpx solid #ff4d4f;
  border-radius: 24rpx;
  color: #ff4d4f;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }

  &:active {
    background-color: #fff2f0;
  }
}

.logout-icon {
  width: 32rpx;
  height: 32rpx;
  color: #ff4d4f;
}

.logout-text {
  margin-left: 16rpx;
  font-size: 32rpx;
}
</style>
