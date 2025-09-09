<script lang="ts" setup></script>

<template>
  <view class="footer">
    <button class="footer-button bg-#4D80F0 text-white">
      提交
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 112rpx;
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24rpx;
  z-index: 10;
  &-button {
    flex: 1;
    height: 80rpx;
    border-radius: 8rpx;
    font-size: 14px;
    font-weight: 500;
    margin-right: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
