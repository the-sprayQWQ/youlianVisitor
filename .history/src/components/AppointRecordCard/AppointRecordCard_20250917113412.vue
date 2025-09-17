<script lang="ts" setup>
import type { IApplicationList } from '@/api/types/role'
import { submitLeaveApplication } from '@/api/role'

const props = defineProps<{ recordList: IApplicationList['records'] }>()
const emit = defineEmits(['toDetail'])
const userStore = useUserStore()
const currentUser = userStore.userInfo.userInfo.id
function toDetail(id: string, applyId: string, applicationName: string, currentNode: string) {
  emit('toDetail', id, applyId, applicationName, currentNode)
}
async function submitLeave(applicationCode: string) {
  const res = await submitLeaveApplication(currentUser, applicationCode)
  if (res.code === 200) {
    console.log(res)
  }
}
// 处理离场按钮点击
function handleLeaveClick(event: Event, item: any) {
  event.stopPropagation() // 阻止事件冒泡
  event.preventDefault() // 阻止默认行为

  uni.showModal({
    title: '确认离场',
    content: `确定要为申请单号 ${item.applicationCode} 发起离场申请吗？`,
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 用户点击了确认按钮
        // TODO: 这里添加离场申请的业务逻辑
        submitLeave(item.applicationCode)
      }
    },
  })
}
</script>

<template>
  <view
    v-for="item in props.recordList"
    :key="item.id"
    class="item"
    @click="toDetail(item.id, item.applicationCode, item.applicationName, item.currentName)"
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
      <view
        class="status text-sm"
        :class="
          item.processType_dictText === '审批中'
            ? 'spz'
            : item.processType_dictText === '已拒绝'
              ? 'yjj'
              : item.processType_dictText === '已通过'
                ? 'ytg'
                : item.processType_dictText === '已入厂'
                  ? 'yrc'
                  : 'ylc'
        "
      >
        {{ item.processType_dictText }}
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
        <view
          class="type text-sm"
          :class="
            item.applicationTypeName === '业务沟通'
              ? 'gt'
              : item.applicationTypeName === '学习交流'
                ? 'jl'
                : 'hy'
          "
        >
          {{ item.applicationTypeName }}
        </view>
        <view class="ml-2 text-sm text-#6B7280">
          {{ item.createTime }}
        </view>
      </view>
      <view
        v-if="item.processType_dictText === '已入厂' && item.currentName !== '门卫离场审批'"
        class="btn text-sm"
        @click.stop="handleLeaveClick($event, item)"
      >
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
      text-align: center;
      border-radius: 50rpx;
      color: #fff;
      &.spz {
        background-color: #f59e0b;
      }
      &.yrc {
        background-color: #3b82f6;
      }
      &.ytg {
        background-color: #10b981;
      }
      &.yjj {
        background-color: #ef4444;
      }
      &.ylc {
        background-color: #6b7280;
      }
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
