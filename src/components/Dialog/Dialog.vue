<script lang="ts" setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['closePopup'])
function closePopup() {
  emit('closePopup', false)
}
</script>

<!-- @click=""  -->
<template>
  <view class="dialog">
    <view class="dialog-content">
      <view class="dialog-header">
        <slot name="title" />
        <view i-tabler:circle-x @click="closePopup" />
      </view>
      <slot name="content" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &-content {
    background-color: #ffffff;
    border-radius: 16rpx;
    width: 80%;
    max-width: 600rpx;
    padding: 32rpx;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
  }

  &-title {
    font-size: 16px;
    font-weight: 500;
    color: #1d2129;
  }

  &-text {
    font-size: 14px;
    color: #4e5969;
  }
}
</style>
