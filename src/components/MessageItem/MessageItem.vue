<script lang="ts" setup>

</script>

<template>
  <view class="message_item">
    <view class="left">
      <view i-carbon:checkmark-filled class="text-lg text-#22c55e" />
    </view>
    <view class="right">
      <view class="flex justify-between">
        <view>访客申请已通过</view>
        <view class="text-sm text-#9caccb">
          10:00
        </view>
      </view>
      <view class="line-clamp-2 mt-1 w-full break-all text-sm text-#4b5563">
        您的学习交流申请已通过审核,访问时间:2025-08-09 14:00
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.message_item {
  width: 700rpx;
  border: 1px solid #f3f4f6;
  box-sizing: border-box;
  border-radius: 25rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  .left {
    width: 80rpx;
    height: 80rpx;
    background-color: #e8f9ef;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .right {
    margin-left: 20rpx;
    flex: 1;
  }
}
</style>
