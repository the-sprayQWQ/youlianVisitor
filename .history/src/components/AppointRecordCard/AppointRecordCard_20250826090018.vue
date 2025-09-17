<script lang="ts" setup>

</script>

<template>
  <view class="item">
    <view class="item_num_row">
      <view class="flex">
        <view class="text-sm text-#6b7284 font-bold">
          申请单号：
        </view>
        <view class="text-sm">
          20250808123
        </view>
      </view>
      <view class="status text-sm">
        已入场
      </view>
    </view>
    <view class="flex">
      <view class="text-sm text-#6b7284 font-bold">
        姓名：
      </view>
      <view class="text-sm">
        张明远
      </view>
    </view>
    <view class="flex">
      <view class="text-sm text-#6b7284 font-bold">
        当前节点：
      </view>
      <view class="text-sm">
        部长主管审批
      </view>
    </view>
    <view class="flex">
      <view class="text-sm text-#6b7284 font-bold">
        目标审批人：
      </view>
      <view class="text-sm">
        王部长
      </view>
    </view>
    <view class="mt-2 flex justify-between">
      <view class="flex">
        <view class="type text-sm">
          业务沟通
        </view>
        <view class="ml-2 text-sm text-#6B7280">
          2023-05-12 09:30
        </view>
      </view>
      <view class="btn text-sm">
        离场
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.item {
  // height: 100rpx;
  background-color: #fff;
  width: 700rpx;
  box-sizing: border-box;
  padding: 35rpx;
  border-radius: 25rpx;
  margin-bottom: 20rpx;
  .item_num_row {
    display: flex;
    justify-content: space-between;
    .status {
      width: 120rpx;
      background-color: #3b82f6;
      text-align: center;
      border-radius: 50rpx;
      color: #fff;
    }
  }
  .btn {
    width: 80rpx;
    color: #fff;
    background-color: #3b82f6;
    text-align: center;
    border-radius: 10rpx;
  }
  .type {
    width: 140rpx;
    border-radius: 50rpx;
    text-align: center;
    background-color: #eff6ff;
    color: #6f86c1;
  }
}
</style>
