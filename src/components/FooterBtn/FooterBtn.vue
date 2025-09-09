<script lang="ts" setup>
const emit = defineEmits(['reject', 'transfer', 'approve'])
function onReject() {
  emit('reject')
}
function onTransfer() {
  emit('transfer')
}
function onApprove() {
  emit('approve')
}
</script>

<template>
  <view class="footer">
    <button class="footer-button reject" @click="onReject">
      驳回
    </button>
    <button class="footer-button transfer" @click="onTransfer">
      转办
    </button>
    <button class="footer-button approve" @click="onApprove">
      通过
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
.reject {
  background-color: #ff4d4f;
  color: #ffffff;
}

.transfer {
  background-color: #165dff;
  color: #ffffff;
}

.approve {
  background-color: #52c41a;
  color: #ffffff;
}
</style>
