<script lang="ts" setup>
import type { IApplicationList } from '@/api/types/role'

const props = defineProps<{ recordList: IApplicationList['records'] }>()
const emit = defineEmits(['toDetail'])
function toDetail(id: string, applyId: string, applicationName: string) {
  emit('toDetail', id, applyId, applicationName)
}
</script>

<template>
  <view
    v-for="item in props.recordList"
    :key="item.id"
    class="item"
    @click="toDetail(item.id, item.applicationCode, item.applicationName)"
  >
    <view class="item_num_row">
      <view class="flex">
        <view class="text-sm text-#6b7284 font-bold">
          申请单号：
        </view>
        <view class="text-sm">
          {{ item.applicationCode }}
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
        {{ item.user }}
      </view>
    </view>
    <view class="flex">
      <view class="text-sm text-#6b7284 font-bold">
        当前节点：
      </view>
      <view class="text-sm">
        {{ item.currentName }}
      </view>
    </view>
    <view class="flex">
      <view class="text-sm text-#6b7284 font-bold">
        目标审批人：
      </view>
      <view class="text-sm">
        {{ item.currentRecordUser }}
      </view>
    </view>
    <view class="mt-2 flex justify-between">
      <view class="flex">
        <view class="type text-sm" :class="item.applicationTypeName === '业务沟通' ? 'gt' : item.applicationTypeName === '学习交流' ? 'jl' : 'hy'">
          {{ item.applicationTypeName }}
        </view>
        <view class="ml-2 text-sm text-#6B7280">
          {{ item.createTime }}
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
    &.gt {
      background-color: #eff6ff;
      color: #6f86c1;
    }
    &.jl {
      background-color: #ecfdf5;
      color: #549173;
    }
    &.hy {
      background-color: #fef2f2;
      color: #c95b81;
    }
  }
}
</style>
