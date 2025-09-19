<route lang="json">
{
  "layout": "tabbar",
  "needLogin": true,
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "审批"
  }
}
</route>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getInVisitorList, getYlfkProcessApplication } from '@/api/role'

const userStore = useUserStore()
const LoginUserId = userStore.userInfo?.userInfo?.id
const roleType = userStore.roleType

// 搜索表单数据
const searchForm = ref({
  startDate: '',
  endDate: '',
  name: '',
  phone: '',
  idCard: '',
})

// 当前激活的tab
const activeTab = ref(0)

// 待审核分页状态
const approvalPagination = ref({
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  hasMore: true,
  total: 0,
})

// 在厂访客分页状态
const inListPagination = ref({
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  hasMore: true,
  total: 0,
})

const approvalList = ref([])
const inList = ref([])

// 根据当前tab筛选访客列表
const visitorList = computed(() => {
  if (activeTab.value === 0) {
    // 待审核
    return approvalList.value
  }

  return inList.value
})

// 获取访客列表
async function getVisitorList(isLoadingMore = false) {
  if (approvalPagination.value.isLoading)
    return

  try {
    approvalPagination.value.isLoading = true

    const currentPageNum = isLoadingMore
      ? approvalPagination.value.currentPage
      : 1

    // 构建搜索参数
    let applicationDate = ''
    if (searchForm.value.startDate && searchForm.value.endDate) {
      applicationDate = `${searchForm.value.startDate},${searchForm.value.endDate}`
    } else if (searchForm.value.startDate) {
      applicationDate = `${searchForm.value.startDate},${searchForm.value.startDate}`
    } else if (searchForm.value.endDate) {
      applicationDate = `${searchForm.value.endDate},${searchForm.value.endDate}`
    }

    const res = await getYlfkProcessApplication(
      currentPageNum,
      approvalPagination.value.pageSize,
      '0',
      LoginUserId,
      undefined, // applicationStatus
      searchForm.value.idCard || undefined, // idCard
      searchForm.value.name || undefined, // user
      applicationDate || undefined, // applicationDate
      searchForm.value.phone || undefined, // applicationCode
    )

    if (res.code === 200) {
      const { records, total, current, pages } = res.result || {}

      if (isLoadingMore) {
        // 加载更多，追加数据
        approvalList.value = [...approvalList.value, ...(records || [])]
      }
      else {
        // 首次加载或刷新，替换数据
        approvalList.value = records || []
        approvalPagination.value.currentPage = 1
      }

      approvalPagination.value.total = total || 0
      approvalPagination.value.hasMore = current < pages

      // 如果是加载更多且还有更多数据，页码+1
      if (isLoadingMore && approvalPagination.value.hasMore) {
        approvalPagination.value.currentPage++
      }
    }
  }
  catch (error) {
    console.error('获取待审核列表失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none',
    })
  }
  finally {
    approvalPagination.value.isLoading = false
  }
}

// 获取已入厂列表
async function getAllReadyIn(isLoadingMore = false) {
  if (inListPagination.value.isLoading)
    return

  try {
    inListPagination.value.isLoading = true

    const currentPageNum = isLoadingMore
      ? inListPagination.value.currentPage
      : 1

    // 构建搜索参数
    let applicationDate = ''
    if (searchForm.value.startDate && searchForm.value.endDate) {
      applicationDate = `${searchForm.value.startDate},${searchForm.value.endDate}`
    } else if (searchForm.value.startDate) {
      applicationDate = `${searchForm.value.startDate},${searchForm.value.startDate}`
    } else if (searchForm.value.endDate) {
      applicationDate = `${searchForm.value.endDate},${searchForm.value.endDate}`
    }

    // 使用 getYlfkProcessApplication 来获取在厂访客列表，状态为 '3'
    const res = await getYlfkProcessApplication(
      currentPageNum,
      inListPagination.value.pageSize,
      '0',
      LoginUserId,
      '3', // applicationStatus 为 '3' 表示在厂访客
      searchForm.value.idCard || undefined, // idCard
      searchForm.value.name || undefined, // user
      applicationDate || undefined, // applicationDate
      searchForm.value.phone || undefined, // applicationCode
    )

    if (res.code === 200) {
      const { records, total, current, pages } = res.result || {}

      if (isLoadingMore) {
        // 加载更多，追加数据
        inList.value = [...inList.value, ...(records || [])]
      }
      else {
        // 首次加载或刷新，替换数据
        inList.value = records || []
        inListPagination.value.currentPage = 1
      }

      inListPagination.value.total = total || 0
      inListPagination.value.hasMore = current < pages

      // 如果是加载更多且还有更多数据，页码+1
      if (isLoadingMore && inListPagination.value.hasMore) {
        inListPagination.value.currentPage++
      }
    }
  }
  catch (error) {
    console.error('获取在厂访客列表失败:', error)
    uni.showToast({
      title: '获取数据失败',
      icon: 'none',
    })
  }
  finally {
    inListPagination.value.isLoading = false
  }
}

onShow(async () => {
  await getVisitorList()
  await getAllReadyIn()
})

// 日期选择器处理方法
function handleStartDateChange(e: any) {
  searchForm.value.startDate = e.detail.value
}

function handleEndDateChange(e: any) {
  searchForm.value.endDate = e.detail.value
}

// 搜索方法
function handleSearch() {
  console.log('搜索', searchForm.value)

  // 重置分页并重新搜索
  if (activeTab.value === 0) {
    approvalPagination.value.currentPage = 1
    approvalPagination.value.hasMore = true
    approvalList.value = [] // 清空当前列表
    getVisitorList()
  }
  else {
    inListPagination.value.currentPage = 1
    inListPagination.value.hasMore = true
    inList.value = [] // 清空当前列表
    getAllReadyIn()
  }
}

// 清空搜索条件
function clearSearch() {
  searchForm.value = {
    startDate: '',
    endDate: '',
    name: '',
    phone: '',
    idCard: '',
  }
  handleSearch() // 重新搜索
}

function toApproval(
  applyId: string,
  applicationType: string,
  currentNode: string,
) {
  if (applicationType === '0' || applicationType === '1') {
    uni.navigateTo({
      url: `/pages/visitorApplication/visitorApplication?applyId=${applyId}&applicationType=${applicationType}&roleType=${roleType}&currentNode=${currentNode}`,
    })
  }
  else {
    uni.navigateTo({
      url: `/pages/employApplication/employApplication?applyId=${applyId}&applicationType=${applicationType}&roleType=${roleType}&currentNode=${currentNode}`,
    })
  }
}

async function changeTab(e) {
  if (e.name === 1) {
    if (inList.value.length === 0) {
      await getAllReadyIn()
    }
  }
  else {
    if (approvalList.value.length === 0) {
      await getVisitorList()
    }
  }
}

// 触底加载更多
onReachBottom(async () => {
  console.log('触底了，准备加载更多数据')

  if (activeTab.value === 0) {
    // 待审核tab
    if (
      !approvalPagination.value.isLoading
      && approvalPagination.value.hasMore
    ) {
      console.log('加载更多待审核数据')
      await getVisitorList(true)
    }
  }
  else {
    // 在厂访客tab
    if (!inListPagination.value.isLoading && inListPagination.value.hasMore) {
      console.log('加载更多在厂访客数据')
      await getAllReadyIn(true)
    }
  }
})

// 下拉刷新
onPullDownRefresh(async () => {
  try {
    if (activeTab.value === 0) {
      await getVisitorList()
    }
    else {
      await getAllReadyIn()
    }
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

// 当前激活tab的分页状态
const currentPagination = computed(() => {
  return activeTab.value === 0
    ? approvalPagination.value
    : inListPagination.value
})
</script>

<template>
  <view class="visitor-management">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-form">
        <view class="form-row">
          <picker
            mode="date"
            :value="searchForm.startDate"
            @change="handleStartDateChange"
            class="date-picker"
          >
            <view class="picker-input" :class="{ 'has-value': searchForm.startDate }">
              {{ searchForm.startDate || '开始日期' }}
            </view>
          </picker>
          <picker
            mode="date"
            :value="searchForm.endDate"
            @change="handleEndDateChange"
            class="date-picker"
          >
            <view class="picker-input" :class="{ 'has-value': searchForm.endDate }">
              {{ searchForm.endDate || '结束日期' }}
            </view>
          </picker>
        </view>
        <view class="form-row">
          <wd-input
            v-model="searchForm.name"
            placeholder="姓名"
            class="form-input"
            clearable
          />
          <wd-input
            v-model="searchForm.idCard"
            placeholder="身份证号"
            class="form-input"
            clearable
          />
        </view>
        <view class="form-row single-input">
          <wd-input
            v-model="searchForm.phone"
            placeholder="申请单号"
            class="form-input"
            clearable
          />
        </view>
        <view class="button-row">
          <wd-button
            type="primary"
            class="search-btn"
            @click="handleSearch"
          >
            <view i-carbon-search class="search-icon" />
            搜索
          </wd-button>
          <wd-button
            type="default"
            class="reset-btn"
            @click="clearSearch"
          >
            <view i-carbon-restart class="reset-icon" />
            重置
          </wd-button>
        </view>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-section">
      <wd-tabs v-model="activeTab" class="tabs" @click="changeTab">
        <wd-tab :title="`待审核 (${approvalList.length})`" :name="0" />
        <wd-tab :title="`在厂访客 (${inList.length})`" :name="1" />
      </wd-tabs>
    </view>

    <!-- 访客列表 -->
    <view class="visitor-list">
      <door-keeper-list
        :visitor-list="visitorList"
        :current-status="activeTab === 0 ? 'waiting' : 'approved'"
        @to-approval="toApproval"
      />

      <!-- 加载状态 -->
      <view v-if="currentPagination.isLoading" class="loading-more">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view
        v-else-if="!currentPagination.hasMore && visitorList.length > 0"
        class="no-more"
      >
        <text class="no-more-text">没有更多数据了</text>
      </view>

      <!-- 空数据状态 -->
      <view
        v-if="visitorList.length === 0 && !currentPagination.isLoading"
        class="empty-state"
      >
        <view class="empty-icon">
          <view class="i-carbon-document-blank empty-icon-img" />
        </view>
        <text class="empty-text">
          {{ activeTab === 0 ? "暂无待审核记录" : "暂无在厂访客记录" }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.visitor-management {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 120rpx;
}

.search-section {
  background-color: #fff;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .search-form {
    .form-row {
      display: flex;
      gap: 20rpx;
      margin-bottom: 24rpx;

      &.single-input {
        justify-content: flex-start;

        .form-input {
          flex: none;
          width: 100%;
        }

        :deep(.wd-input) {
          width: 100% !important;
        }
      }

      .form-input {
        flex: 1;
        height: 80rpx;
        background-color: #f5f5f5;
        border-radius: 12rpx;
        border: 1rpx solid #e0e0e0;
        font-size: 28rpx;
        color: #333;
        transition: all 0.2s ease;

        &:focus {
          background-color: #fff;
          border-color: #007aff;
        }
      }

      .date-picker {
        flex: 1;

        .picker-input {
          height: 80rpx;
          background-color: #fafbfc;
          border-radius: 12rpx;
          border: 1rpx solid #e0e0e0;
          display: flex;
          align-items: center;
          padding: 0 24rpx;
          font-size: 28rpx;
          color: #999;
          transition: all 0.2s ease;
          position: relative;

          &.has-value {
            color: #333;
            background-color: #fff;
            border-color: #007aff;
          }

          &::after {
            content: '';
            position: absolute;
            right: 24rpx;
            width: 28rpx;
            height: 28rpx;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
          }

          &:active {
            background-color: #fff;
            border-color: #007aff;
          }
        }
      }

      &:last-of-type {
        margin-bottom: 32rpx;
      }
    }

    .button-row {
      display: flex;
      gap: 20rpx;
      margin-top: 8rpx;
    }

    .search-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;
      height: 80rpx;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 500;
      background-color: #007aff;
      color: #fff;
      border: none;
      transition: all 0.2s ease;

      &:active {
        background-color: #0056d3;
        transform: scale(0.98);
      }

      .search-icon {
        width: 32rpx;
        height: 32rpx;
        color: #fff;
      }
    }

    .reset-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;
      height: 80rpx;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 500;
      background-color: #f5f5f5;
      color: #666;
      border: 1rpx solid #e0e0e0;
      transition: all 0.2s ease;

      &:active {
        background-color: #e0e0e0;
        transform: scale(0.98);
      }

      .reset-icon {
        width: 32rpx;
        height: 32rpx;
        color: #666;
      }
    }
  }
}

.tab-section {
  background-color: #fff;
  border-bottom: 2rpx solid #f0f0f0;

  .tabs {
    :deep(.wd-tabs__nav) {
      padding: 0 32rpx;
      background-color: #fff;
    }

    :deep(.wd-tab) {
      padding: 32rpx 0;
      font-size: 32rpx;
      font-weight: 500;
      color: #666;
    }

    :deep(.wd-tab--active) {
      color: #4285f4;
      font-weight: 600;
    }

    :deep(.wd-tabs__line) {
      background-color: #4285f4;
      height: 6rpx;
      border-radius: 3rpx;
    }
  }
}

.visitor-list {
  padding: 24rpx 32rpx 0;

  // 加载更多状态 - 新增
  .loading-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;

    .loading-text {
      font-size: 28rpx;
      color: #999;
    }
  }

  // 没有更多数据 - 新增
  .no-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx 0;

    .no-more-text {
      font-size: 28rpx;
      color: #ccc;
    }
  }

  // 空数据状态 - 新增
  .empty-state {
    text-align: center;
    padding: 120rpx 0;

    .empty-icon {
      margin-bottom: 32rpx;

      .empty-icon-img {
        width: 120rpx;
        height: 120rpx;
        color: #d1d5db;
      }
    }

    .empty-text {
      font-size: 32rpx;
      color: #9ca3af;
    }
  }
}

// 深度选择器样式调整
:deep(.wd-input) {
  .wd-input__inner {
    height: 88rpx;
    border-radius: 16rpx;
    border: 2rpx solid #e8eaed;
    font-size: 30rpx;
    padding: 0 24rpx;
    background-color: #fafbfc;
    transition: all 0.2s ease;

    &::placeholder {
      color: #9aa0a6;
      font-size: 30rpx;
    }

    &:focus {
      border-color: #4285f4;
      background-color: #fff;
      box-shadow: 0 0 0 4rpx rgba(66, 133, 244, 0.1);
    }
  }

  .wd-input__suffix {
    color: #9aa0a6;
  }
}

:deep(.wd-button) {
  font-weight: 500;
  transition: all 0.2s ease;

  &.wd-button--primary {
    background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
    border-color: transparent;

    &:active {
      transform: translateY(1rpx);
      box-shadow: 0 2rpx 8rpx rgba(66, 133, 244, 0.2);
    }
  }

  &.wd-button--warning {
    background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%);
    border-color: transparent;
    color: #fff;

    &:active {
      transform: translateY(1rpx);
    }
  }

  &.wd-button--small {
    border-radius: 28rpx;
  }
}

:deep(.wd-tabs__nav) {
  border-bottom: 2rpx solid #f0f0f0;
}
</style>
