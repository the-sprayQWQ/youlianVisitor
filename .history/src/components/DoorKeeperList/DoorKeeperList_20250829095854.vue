<script lang="ts" setup>
const props = defineProps({
  visitorList: [],
})
</script>

<template>
  <view v-for="item in props.visitorList" :key="item.id" class="visitor-item">
    <!-- 申请单号和状态 -->
    <view class="item-header">
      <text class="item-id">申请单号: {{ item.id }}</text>
      <view class="status-tag">
        待审核
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
        <text class="info-text">申请时间: {{ item.time }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="item-actions">
      <view class="action-tag">
        <view class="i-carbon-document-requirements btn-icon" />
        审批
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
      background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%);
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
      background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
      color: #fff;
      padding: 10rpx 20rpx;
      box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.2);
      justify-content: center;

      .btn-icon {
        width: 28rpx;
        height: 28rpx;
      }
    }
  }
}
</style>
