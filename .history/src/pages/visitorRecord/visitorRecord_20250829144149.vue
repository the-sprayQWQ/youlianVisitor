<script lang="ts" setup>
import { ref } from 'vue'
import QRCodeGenerator from '@/components/QRCodeGenerator.vue'

const showQRCode = ref(false)
const visitorForm = ref({
  name: '',
  phone: '',
  company: '',
  purpose: '',
  visitDate: '',
  validTime: 120, // 默认2小时
})

// 提交访客信息
function submitVisitor() {
  // 表单验证
  if (!visitorForm.value.name) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  if (!visitorForm.value.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }

  // 生成二维码
  showQRCode.value = true
}

// 返回修改
function goBack() {
  showQRCode.value = false
}
</script>

<template>
  <view class="visitor-register">
    <!-- 访客登记表单 -->
    <view v-if="!showQRCode" class="register-form">
      <view class="form-header">
        <text class="form-title">访客登记</text>
      </view>

      <view class="form-content">
        <view class="input-group">
          <text class="input-label">姓名 *</text>
          <input
            v-model="visitorForm.name"
            class="input-field"
            placeholder="请输入姓名"
          >
        </view>

        <view class="input-group">
          <text class="input-label">手机号 *</text>
          <input
            v-model="visitorForm.phone"
            class="input-field"
            type="tel"
            placeholder="请输入手机号"
          >
        </view>

        <view class="input-group">
          <text class="input-label">公司</text>
          <input
            v-model="visitorForm.company"
            class="input-field"
            placeholder="请输入公司名称"
          >
        </view>

        <view class="input-group">
          <text class="input-label">访问事由</text>
          <textarea
            v-model="visitorForm.purpose"
            class="textarea-field"
            placeholder="请输入访问事由"
          />
        </view>

        <view class="input-group">
          <text class="input-label">访问日期</text>
          <picker
            v-model="visitorForm.visitDate"
            mode="date"
            @change="e => visitorForm.visitDate = e.detail.value"
          >
            <input
              class="input-field"
              :value="visitorForm.visitDate"
              placeholder="请选择访问日期"
              disabled
            >
          </picker>
        </view>

        <view class="input-group">
          <text class="input-label">有效时长</text>
          <picker
            :range="[30, 60, 120, 240, 480]"
            range-key="label"
            @change="e => visitorForm.validTime = [30, 60, 120, 240, 480][e.detail.value]"
          >
            <input
              class="input-field"
              :value="`${visitorForm.validTime}分钟`"
              disabled
            >
          </picker>
        </view>
      </view>

      <button class="submit-btn" @click="submitVisitor">
        生成访客二维码
      </button>
    </view>

    <!-- 二维码展示 -->
    <view v-else class="qrcode-view">
      <QRCodeGenerator :visitor-info="visitorForm" />
      <button class="back-btn" @click="goBack">
        返回修改
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.visitor-register {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 32rpx;
}

.register-form {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
}

.form-header {
  text-align: center;
  margin-bottom: 40rpx;

  .form-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
  }
}

.form-content {
  margin-bottom: 40rpx;
}

.input-group {
  margin-bottom: 32rpx;

  .input-label {
    display: block;
    font-size: 30rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .input-field,
  .textarea-field {
    width: 100%;
    padding: 24rpx;
    border: 2rpx solid #e5e7eb;
    border-radius: 12rpx;
    font-size: 30rpx;
    color: #333;
    background: #fafbfc;
    box-sizing: border-box;

    &:focus {
      border-color: #4285f4;
      background: #fff;
    }

    &::placeholder {
      color: #9ca3af;
    }

    &:disabled {
      background: #f9fafb;
      color: #6b7280;
    }
  }

  .textarea-field {
    height: 120rpx;
    resize: none;
  }
}

.submit-btn,
.back-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: 600;

  &::after {
    border: none;
  }

  &:active {
    transform: translateY(2rpx);
  }
}

.back-btn {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  margin-top: 24rpx;
}
</style>
