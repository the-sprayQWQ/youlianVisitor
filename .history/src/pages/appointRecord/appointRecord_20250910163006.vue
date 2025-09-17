<route lang="jsonc">
{
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "预约记录",
  },
}
</route>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getYlfkApplicationList } from '@/api/role'

const applyList = ref([])

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(20)
const isLoading = ref(false)
const hasMore = ref(true)
const total = ref(0)

// 获取列表数据
async function getApplyList(isLoadMore = false) {
  if (isLoading.value)
    return

  try {
    isLoading.value = true
    const userStore = useUserStore()
    const createBy = userStore.userInfo?.userInfo?.username

    const res = await getYlfkApplicationList(
      isLoadMore ? currentPage.value : 1,
      pageSize.value,
      createBy,
    )

    if (res.code === 200) {
      const { records, total: totalCount, current, pages } = res.result

      if (isLoadMore) {
        // 上拉加载更多：追加数据
        applyList.value = [...applyList.value, ...records]
      }
      else {
        // 首次加载或刷新：替换数据
        applyList.value = records
        currentPage.value = 1
      }

      total.value = totalCount

      // 判断是否还有更多数据
      hasMore.value = current < pages

      // 如果是加载更多，页码+1
      if (isLoadMore && hasMore.value) {
        currentPage.value++
      }
    }
  }
  catch (error) {
    console.error('获取申请列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
  finally {
    isLoading.value = false
  }
}

// 上拉加载更多
async function loadMore() {
  if (!hasMore.value || isLoading.value)
    return

  currentPage.value++
  await getApplyList(true)
}

// 下拉刷新
async function onRefresh() {
  currentPage.value = 1
  hasMore.value = true
  await getApplyList(false)
}

// 搜索功能
const value = ref<number>(Date.now())
const applyId = ref<string>('')

async function handleSearch() {
  // 重置分页状态
  currentPage.value = 1
  hasMore.value = true

  // 这里可以添加搜索参数的处理逻辑
  await getApplyList(false)
}

// 页面加载
onLoad(async () => {
  await getApplyList()
})

// 上拉加载监听
onReachBottom(async () => {
  await loadMore()
})

// 下拉刷新监听
onPullDownRefresh(async () => {
  await onRefresh()
  uni.stopPullDownRefresh()
})

const userStore = useUserStore()
const roleType = computed(() => userStore.roleType)

function toDetail(id: string, applyId: string, applicationName: string) {
  uni.navigateTo({
    url: `/pages/visitorApplication/visitorApplication?id=${id}&applyId=${applyId}&roleType=${roleType.value}&applicationType=${applicationName}`,
  })
}
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
          @click="handleSearch"
        >
          搜索
        </button>
      </view>
    </view>

    <!-- 主体部分 -->
    <view class="content">
      <appoint-record-card :record-list="applyList" @to-detail="toDetail" />

      <!-- 加载状态提示 -->
      <view class="load-status">
        <view v-if="isLoading" class="loading">
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="!hasMore && applyList.length > 0" class="no-more">
          <text class="no-more-text">已加载全部数据</text>
        </view>
        <view v-else-if="applyList.length === 0 && !isLoading" class="empty">
          <text class="empty-text">暂无数据</text>
        </view>
      </view>
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

// 加载状态样式
.load-status {
  padding: 30rpx;
  text-align: center;

  .loading,
  .no-more,
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
  }

  .loading-text {
    color: #666;
    font-size: 28rpx;

    &::before {
      content: '';
      display: inline-block;
      width: 20rpx;
      height: 20rpx;
      border: 2rpx solid #3b82f6;
      border-top-color: transparent;
      border-radius: 50%;
      animation: loading 1s linear infinite;
      margin-right: 10rpx;
    }
  }

  .no-more-text {
    color: #999;
    font-size: 26rpx;
  }

  .empty-text {
    color: #ccc;
    font-size: 28rpx;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
