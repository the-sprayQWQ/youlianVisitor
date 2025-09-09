<route lang="jsonc">
{
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "预约记录",
  },
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'
import { getYlfkApplicationList } from '@/api/role'

const applyList = ref([])

async function getApplyList() {
  const userStore = useUserStore()
  const createBy = userStore.userInfo?.userInfo?.username
  const res = await getYlfkApplicationList(createBy)
  if (res.code === 200) {
    console.log(res.result.records)
    applyList.value = res.result.records
  }
}
onLoad(async () => {
  await getApplyList()
})

const value = ref<number>(Date.now())
const applyId = ref<string>('')
</script>

<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search">
      <view class="text-sm text-#9ba1a5">
        申请日期
      </view>
      <view class="date_select_bar">
        <wd-datetime-picker v-model="value" type="date" />
        <text class="ml-2.5 mr-2.5 mt-2 text-sm text-#9ba1a5">至</text>
        <wd-datetime-picker v-model="value" type="date" />
      </view>
      <view class="text-sm text-#9ba1a5">
        申请单号
      </view>
      <view class="search_input">
        <wd-input
          v-model="applyId"
          prefix-icon=""
          suffix-icon="search"
          placeholder="请输入申请单号"
          no-border
        />
      </view>
      <view class="text-sm text-#9ba1a5">
        业务类型
      </view>
      <view class="select_bar">
        <wd-picker />
      </view>
      <view class="submit">
        <button
          style="
            height: 68rpx;
            font-size: 30rpx;
            line-height: 68rpx;
            color: #fff;
            background-color: #3b82f6;
            border: none;
          "
        >
          搜索
        </button>
      </view>
    </view>
    <!-- 主体部分 -->
    <view class="content">
      <appoint-record-card :record-list="applyList" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
::v-deep .search_input {
  border: 1px solid #edeff1 !important;
  border-radius: 25rpx;
  width: 100%;
  height: 68rpx;
  overflow: hidden;
  .wd-input__value {
    margin-top: 10rpx;
    box-sizing: border-box;
    padding-left: 30rpx;
    .wd-input__suffix {
      margin-right: 20rpx;
      font-size: 20rpx;
    }
  }
}
::v-deep .wd-picker {
  height: 68rpx !important;
  border-radius: 25rpx;
  overflow: hidden;
  .wd-picker__cell {
    height: 100%;
    .wd-cell__wrapper {
      margin-top: -10rpx;
    }
  }
}
page {
  min-height: 95vh;
  background-color: #f9fafb;
}
.container {
  min-height: 95vh;
  width: 100%;
  background-color: #f9fafb;
  padding: 25rpx;
}
.search {
  width: 700rpx;
  background-color: white;
  box-sizing: border-box;
  padding: 25rpx;
  border-radius: 25rpx;
  .date_select_bar {
    display: flex;
    margin: 10rpx 0;
  }
  .search_input {
    margin: 10rpx 0;
  }
  .select_bar {
    margin: 10rpx 0;
  }
}
.content {
  margin-top: 20rpx;
}
</style>
