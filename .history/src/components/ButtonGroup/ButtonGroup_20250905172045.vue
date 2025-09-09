<script lang="ts" setup>
interface Props {
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
}
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
})
const emit = defineEmits(['closePopup', 'confirm'])
function closePopup() {
  emit('closePopup', false)
}
function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <view class="buttonGroup flex">
    <view style="margin-left: auto">
      <wd-button
        :round="false"
        size="medium"
        type="info"
        plain
        @click="closePopup"
      >
        取消
      </wd-button>
    </view>
    <view style="margin-left: 20rpx">
      <wd-button :round="false" size="medium" :type="props.type" @click="handleConfirm">
        确定
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss">
.flex {
  display: flex;
}

.buttonGroup {
  width: 65%;
  margin-top: 20rpx;
  margin-left: auto;
}
</style>
