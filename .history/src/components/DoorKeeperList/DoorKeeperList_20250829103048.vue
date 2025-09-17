<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  visitorList: [],
  currentStatus: {
    type: String,
    default: 'waiting', // waiting: 待审核, approved: 在厂访客
  },
})

// 弹窗控制
const showSignOutModal = ref(false)
const currentSignOutItem = ref(null)

// 签离表单数据
const signOutForm = ref({
  visitorCard: false,
  licensePlate: false,
})

// 根据当前状态获取标签信息
function getStatusInfo() {
  if (props.currentStatus === 'waiting') {
    return {
      text: '待审核',
      class: 'status-waiting',
    }
  }
  else {
    return {
      text: '在厂中',
      class: 'status-approved',
    }
  }
}

// 根据当前状态获取操作按钮信息
function getActionInfo() {
  if (props.currentStatus === 'waiting') {
    return {
      text: '审批',
      icon: 'i-carbon-document-requirements',
      class: 'action-approve',
    }
  }
  else {
    return {
      text: '签离',
      icon: 'i-carbon-logout',
      class: 'action-checkout',
    }
  }
}

// 处理签离按钮点击
function handleSignOut(item: any) {
  currentSignOutItem.value = item
  // 重置表单
  signOutForm.value = {
    visitorCard: false,
    licensePlate: false,
  }
  showSignOutModal.value = true
}

// 确认签离
function confirmSignOut() {
  console.log('确认签离', {
    visitor: currentSignOutItem.value,
    form: signOutForm.value,
  })
  // 这里可以调用API进行签离操作
  showSignOutModal.value = false
}

// 取消签离
function cancelSignOut() {
  showSignOutModal.value = false
}
</script>

<template>
  <view
    v-for="item in props.visitorList"
    :key="item.id"
    class="visitor-item"
    :class="{ 'visitor-item--approved': props.currentStatus === 'approved' }"
  >
    <!-- 申请单号和状态 -->
    <view class="item-header">
      <text class="item-id">申请单号: {{ item.id }}</text>
      <view
        class="status-tag"
        :class="getStatusInfo().class"
      >
        {{ getStatusInfo().text }}
      </view>
    </view>

    <!-- 访客信息 -->
    <view class="item-content">
      <view class="visitor-name">
        {{ item.name }}
      </view>
      <view class="visitor-info">
        <text class="info-text">身份证: {{ item.phone }}</text>
      </view>
      <view class="visitor-info">
        <text class="info-text">申请类型: {{ item.type }}</text>
      </view>
      <view class="visitor-info">
        <text class="info-text">
          {{ props.currentStatus === 'approved' ? '进入时间' : '申请时间' }}: {{ item.time }}
        </text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="item-actions">
      <!-- 审批状态：只是显示标签 -->
      <view
        v-if="props.currentStatus === 'waiting'"
        class="action-tag action-approve"
      >
        <view :class="`${getActionInfo().icon} btn-icon`" />
        {{ getActionInfo().text }}
      </view>
      <!-- 签离状态：可点击按钮 -->
      <view
        v-else
        class="action-tag action-checkout"
        @click="handleSignOut(item)"
      >
        <view :class="`${getActionInfo().icon} btn-icon`" />
        {{ getActionInfo().text }}
      </view>
    </view>
  </view>

  <!-- 签离弹窗 -->
  <wd-popup
    v-model="showSignOutModal"
    position="center"
    :close-on-click-modal="false"
  >
    <view class="sign-out-modal">
      <view class="modal-header">
        <text class="modal-title">回收访客证</text>
      </view>

      <view class="modal-content">
        <view class="checkbox-item">
          <wd-checkbox v-model="signOutForm.visitorCard" />
          <text class="checkbox-label">临时访客证号: V20231115</text>
        </view>
        <view class="checkbox-item">
          <wd-checkbox v-model="signOutForm.licensePlate" />
          <text class="checkbox-label">收到车牌号: 苏A88888</text>
        </view>
      </view>

      <view class="modal-actions">
        <wd-button
          class="cancel-btn"
          @click="cancelSignOut"
        >
          取消
        </wd-button>
        <wd-button
          type="primary"
          class="confirm-btn"
          @click="confirmSignOut"
        >
          确认签离
        </wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.visitor-item {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;

  // 在厂访客状态保持普通样式
  &.visitor-item--approved {
    // 移除绿色边框，保持原有样式
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;

    .item-id {
      font-size: 28rpx;
      color: #666;
      font-weight: 400;
    }

    .status-tag {
      color: #fff;
      padding: 4rpx 16rpx;
      border-radius: 35rpx;
      font-size: 22rpx;
      font-weight: 700;
      min-width: 80rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      // 待审核状态样式
      &.status-waiting {
        background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%);
      }

      // 在厂访客状态样式
      &.status-approved {
        background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
      }
    }
  }

  .item-content {
    margin-bottom: 40rpx;

    .visitor-name {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 24rpx;
      line-height: 1.2;
    }

    .visitor-info {
      margin-bottom: 16rpx;
      line-height: 1.5;

      .info-text {
        font-size: 30rpx;
        color: #666;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .item-actions {
    display: flex;
    justify-content: flex-end;

    .action-tag {
      display: flex;
      align-items: center;
      gap: 8rpx;
      min-width: 120rpx;
      height: 40rpx;
      font-size: 26rpx;
      font-weight: 500;
      border-radius: 8rpx;
      color: #fff;
      padding: 10rpx 20rpx;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: pointer;

      .btn-icon {
        width: 28rpx;
        height: 28rpx;
      }

      // 审批标签样式（纯展示）
      &.action-approve {
        background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
        box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.2);
        cursor: default;
      }

      // 签离按钮样式（可点击）
      &.action-checkout {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
        box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
        cursor: pointer;

        &:active {
          transform: translateY(1rpx);
        }
      }
    }
  }
}

// 签离弹窗样式
.sign-out-modal {
  background: #fff;
  border-radius: 24rpx;
  padding: 0;
  width: 600rpx;
  max-width: 90vw;

  .modal-header {
    padding: 48rpx 40rpx 32rpx;
    text-align: center;
    border-bottom: 1rpx solid #f0f0f0;

    .modal-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .modal-content {
    padding: 40rpx;

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 32rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .checkbox-label {
        font-size: 30rpx;
        color: #333;
        line-height: 1.4;
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 24rpx;
    padding: 32rpx 40rpx 48rpx;

    .cancel-btn,
    .confirm-btn {
      flex: 1;
      height: 88rpx;
      border-radius: 16rpx;
      font-size: 32rpx;
      font-weight: 500;
    }

    .cancel-btn {
      background: #f5f5f5;
      color: #666;
      border-color: transparent;

      &:active {
        background: #e8e8e8;
      }
    }

    .confirm-btn {
      background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
      border-color: transparent;

      &:active {
        transform: translateY(1rpx);
      }
    }
  }
}

// 弹窗组件样式覆盖
:deep(.wd-popup) {
  .wd-popup__modal {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
