<script lang="ts" setup>
const props = defineProps({
  visitorList: [],
  currentStatus: {
    type: String,
    default: 'waiting', // waiting: 待审核, approved: 在厂访客
  },
})

// 根据状态获取标签信息
function getStatusInfo(status: string) {
  if (status === 'waiting') {
    return {
      text: '待审核',
      class: 'status-waiting',
    }
  }
  else if (status === 'approved') {
    return {
      text: '在厂中',
      class: 'status-approved',
    }
  }
  return {
    text: '待审核',
    class: 'status-waiting',
  }
}

// 根据状态获取操作按钮信息
function getActionInfo(status: string) {
  if (status === 'waiting') {
    return {
      text: '审批',
      icon: 'i-carbon-document-requirements',
      class: 'action-approve',
    }
  }
  else if (status === 'approved') {
    return {
      text: '签离',
      icon: 'i-carbon-logout',
      class: 'action-checkout',
    }
  }
  return {
    text: '审批',
    icon: 'i-carbon-document-requirements',
    class: 'action-approve',
  }
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
        :class="getStatusInfo(props.currentStatus).class"
      >
        {{ getStatusInfo(props.currentStatus).text }}
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
      <view
        class="action-tag"
        :class="getActionInfo(props.currentStatus).class"
      >
        <view :class="`${getActionInfo(props.currentStatus).icon} btn-icon`" />
        {{ getActionInfo(props.currentStatus).text }}
      </view>
    </view>
  </view>
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

  // 在厂访客状态的绿色边框
  &.visitor-item--approved {
    border: 4rpx solid #10b981;
    box-shadow: 0 2rpx 16rpx rgba(16, 185, 129, 0.1);
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

      .btn-icon {
        width: 28rpx;
        height: 28rpx;
      }

      // 审批按钮样式
      &.action-approve {
        background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
        box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.2);
      }

      // 签离按钮样式
      &.action-checkout {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
        box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
      }

      &:active {
        transform: translateY(1rpx);
      }
    }
  }
}
</style>
