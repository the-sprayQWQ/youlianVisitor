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
import { toast } from '@/utils/toast'

const userStore = useUserStore()

// 状态栏高度
const statusBarHeight = ref(0)
// 控制手机号授权弹窗
const showPhoneAuth = ref(false)
// 存储微信登录后的code
const currentWxCode = ref('')

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

// 访客登录 - 先微信登录
async function visitorLogin() {
  uni.showModal({
    title: '提示',
    content: '是否使用访客登录?',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '登录中...' })
          
          // 使用store的微信登录方法
          const loginResult = await userStore.wxLogin()
          
          uni.hideLoading()
          
          if (loginResult) {
            toast.success('登录成功')
            
            // 登录成功后，延迟弹出手机号授权
            setTimeout(() => {
              showPhoneAuth.value = true
            }, 1000)
          }
          
        } catch (error) {
          uni.hideLoading()
          console.error('登录失败:', error)
          toast.error('登录失败，请重试')
        }
      }
    },
  })
}

// 获取手机号
async function getPhoneNumber(e) {
  console.log('获取手机号事件:', e)
  
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    try {
      uni.showLoading({ title: '授权中...' })
      
      // 获取最新的微信code用于解密
      const { code } = await getWxCode()
      
      // 调用解密手机号接口
      const phoneRes = await decryptPhoneNumber({
        code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
      
      uni.hideLoading()
      
      if (phoneRes?.success) {
        // 保存手机号到用户信息
        const currentUserInfo = userStore.userInfo
        currentUserInfo.userInfo.phone = phoneRes.phoneNumber
        userStore.setUserInfo(currentUserInfo)
        
        toast.success('手机号授权成功')
        
        // 跳转到首页
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index',
          })
        }, 1000)
      } else {
        throw new Error(phoneRes?.message || '解密失败')
      }
      
    } catch (error) {
      uni.hideLoading()
      console.error('获取手机号失败:', error)
      toast.error('获取手机号失败，请重试')
    }
  } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
    // 用户拒绝授权
    uni.showModal({
      title: '提示',
      content: '未授权手机号，是否继续进入系统？',
      success: (res) => {
        if (res.confirm) {
          // 不获取手机号也可以进入
          showPhoneAuth.value = false
          uni.switchTab({
            url: '/pages/index/index',
          })
        }
        // 否则保持在授权弹窗，用户可以重新尝试
      }
    })
  }
}

// 获取微信code（复用store中的方法）
async function getWxCode() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: resolve,
      fail: reject
    })
  })
}

// 跳过手机号授权
function skipPhoneAuth() {
  uni.showModal({
    title: '提示',
    content: '确定跳过手机号授权吗？部分功能可能受限。',
    success: (res) => {
      if (res.confirm) {
        showPhoneAuth.value = false
        uni.switchTab({
          url: '/pages/index/index',
        })
      }
    }
  })
}

// 关闭手机号授权弹窗
function closePhoneAuth() {
  showPhoneAuth.value = false
}

// 解密手机号（调用后端接口）
async function decryptPhoneNumber(data: {
  code: string
  encryptedData: string
  iv: string
}) {
  try {
    const res = await uni.request({
      url: '/api/decrypt-phone', // 使用相对路径，由unibest的代理配置处理
      method: 'POST',
      data,
      header: {
        'Content-Type': 'application/json',
        // 如果需要token，从store中获取
        'Authorization': `Bearer ${userStore.userInfo.token}`
      }
    })
    
    return res.data
  } catch (error) {
    console.error('调用解密接口失败:', error)
    throw error
  }
}

function adminLogin() {
  uni.navigateTo({ url: '/pages/login/admin' })
}
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
      
      <!-- 访客申请按钮 -->
      <button class="visitor" @click="visitorLogin">
        <view i-carbon:user-follow class="mr-2 h-19px w-19px" />
        访客申请
      </button>

      <button class="admin" @click="adminLogin">
        <view i-carbon:locked class="mr-2 h-19px w-19px" />
        管理员登录
      </button>
    </view>

    <!-- 手机号授权弹窗 -->
    <view v-if="showPhoneAuth" class="phone-auth-overlay" @click.self="closePhoneAuth">
      <view class="phone-auth-popup">
        <view class="popup-header">
          <text class="popup-title">获取手机号</text>
          <view class="close-btn" @click="closePhoneAuth">
            <view i-carbon:close class="w-24px h-24px" />
          </view>
        </view>
        
        <view class="popup-content">
          <view class="phone-icon">
            <view i-carbon:phone class="w-64px h-64px text-blue-500" />
          </view>
          <text class="auth-desc">
            为了更好的服务体验，需要获取您的手机号用于身份验证和消息通知
          </text>
          <text class="auth-tips">
            授权后可享受完整功能体验
          </text>
        </view>
        
        <view class="popup-buttons">
          <button 
            class="auth-btn"
            open-type="getPhoneNumber" 
            @getphonenumber="getPhoneNumber"
          >
            <view i-carbon:checkmark class="mr-2 w-20px h-20px" />
            授权手机号
          </button>
          
          <button class="skip-btn" @click="skipPhoneAuth">
            <view i-carbon:skip-forward class="mr-2 w-20px h-20px" />
            暂时跳过
          </button>
        </view>
      </view>
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

// 手机号授权弹窗样式
.phone-auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.phone-auth-popup {
  background: white;
  border-radius: 16rpx;
  padding: 0;
  width: 640rpx;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
}

.popup-content {
  padding: 40rpx;
  text-align: center;
}

.phone-icon {
  margin-bottom: 24rpx;
  display: flex;
  justify-content: center;
}

.auth-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
}

.auth-tips {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.popup-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 40rpx 40rpx;
}

.auth-btn {
  background: linear-gradient(135deg, #007aff 0%, #0056d3 100%);
  color: white;
  border-radius: 12rpx;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
  transition: all 0.2s;
  
  &::after {
    border: none;
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.3);
  }
}

.skip-btn {
  background: #f5f5f5;
  color: #666;
  border-radius: 12rpx;
  font-size: 28rpx;
  height: 72rpx;
  line-height: 72rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &::after {
    border: none;
  }
  
  &:active {
    background-color: #e8e8e8;
  }
}
</style>