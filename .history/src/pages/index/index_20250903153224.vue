<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "layout": "tabbar",
  "needLogin": true, // 是否需要登录"
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "首页",
  },
}
</route>

<script lang="ts" setup>
import { getYlfkApplicationList } from '@/api/role'

const applyList = ref([])
async function getApplyList() {
  const userStore = useUserStore()
  const createBy = userStore.userInfo?.userInfo?.username
  const res = await getYlfkApplicationList(1, 4, createBy)
  if (res.code === 200) {
    applyList.value = res.result.records
  }
}

onLoad(async () => {
  await getApplyList()
})
function handleEntryClick(type: string) {
  console.log('点击了功能入口:', type)
  // 这里可以添加跳转逻辑
  switch (type) {
    case 'visitor':
      uni.navigateTo({ url: '/pages/visitorApplication/visitorApplication' })
      break
    case 'record':
      uni.navigateTo({ url: '/pages/appointRecord/appointRecord' })
      break
    case 'employee':
      uni.navigateTo({ url: '/pages/employApplication/employApplication' })
      break
    default:
      break
  }
}

function handleRecordClick(id: number, applyId?: string, roleType: string) {
  console.log('点击了记录项:', id, applyId)
  // 这里可以添加跳转逻辑
  uni.navigateTo({
    url: `/pages/visitorApplication/visitorApplication?id=${id}&applyId=${
      applyId
    }&roleType=${roleType}`,
  })
}
const userStore = useUserStore()
const roleType = computed(() => userStore.roleType)
</script>

<template>
  <view class="container">
    <!-- 主内容区 -->
    <scroll-view class="main-content" scroll-y :show-scrollbar="false">
      <!-- 欢迎标题 -->
      <view class="welcome-section">
        <text class="welcome-title">您好，欢迎使用访客系统</text>
        <text class="welcome-subtitle">请选择您需要的服务</text>
      </view>

      <!-- 功能入口区 -->
      <view class="entry-grid">
        <!-- 访客入厂申请 -->
        <view class="entry-card" @click="handleEntryClick('visitor')">
          <uni-icons
            type="personadd"
            size="24"
            color="#1677FF"
            class="entry-icon"
          />
          <text class="entry-text">访客入厂申请</text>
        </view>

        <!-- 员工核验申请 -->
        <view class="entry-card" @click="handleEntryClick('employee')">
          <uni-icons
            type="contact"
            size="24"
            color="#1677FF"
            class="entry-icon"
          />
          <text class="entry-text">员工核验申请</text>
        </view>

        <!-- 预约记录 -->
        <view class="entry-card" @click="handleEntryClick('record')">
          <uni-icons
            type="calendar"
            size="24"
            color="#1677FF"
            class="entry-icon"
          />
          <text class="entry-text">预约记录</text>
        </view>
      </view>

      <!-- 最近申请板块 -->
      <view class="recent-application">
        <!-- 标题栏 -->
        <view class="section-header">
          <text class="section-title">最近申请</text>
          <text class="view-all" @click="handleEntryClick('record')">
            查看全部
          </text>
        </view>

        <!-- 申请记录列表 -->
        <view class="record-list">
          <!-- 记录项1 -->
          <view v-for="(item, index) in applyList" :key="item.id" class="record-item" @click="handleRecordClick(1, '2025080812', roleType)">
            <view class="record-content">
              <text class="record-title">业务沟通</text>
              <text class="record-info">申请单号：20250808123</text>
              <view class="record-details">
                <text class="record-detail">当前节点：部门审批</text>
                <text class="record-detail">审批人：李晓明</text>
              </view>
              <text class="record-time">2025-08-08 14:30</text>
            </view>
            <view class="status-tag pending">
              待审批
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
page {
  min-height: 100%;
  overflow-x: hidden;
}

/* 隐藏所有滚动条 */
::-webkit-scrollbar {
  display: none;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #f5f5f5;
}

.nav-bar {
  height: 88rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.main-content {
  flex: 1;
  padding: 32rpx;
  box-sizing: border-box;
}

.welcome-section {
  margin-bottom: 40rpx;
}

.welcome-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.welcome-subtitle {
  font-size: 28rpx;
  color: #8c8c8c;
  display: block;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 48rpx;
}

.entry-card {
  height: 176rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  ::v-deep .uni-icons {
    display: inline-block !important;
    width: 48rpx !important;
    height: 48rpx !important;
    font-size: 48rpx !important;
    color: #1677ff !important;
  }
}

.entry-icon {
  margin-bottom: 16rpx;
  display: inline-block !important; // 强制设为行内块元素
  width: 48rpx !important;
  height: 48rpx !important;
  font-size: 48rpx !important;
}

.entry-text {
  font-size: 28rpx;
  color: #333333;
}

.recent-application {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.view-all {
  font-size: 24rpx;
  color: #1677ff;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx;
  border-radius: 16rpx;
}

.record-content {
  flex: 1;
}

.record-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
  display: block;
}

.record-info {
  font-size: 24rpx;
  color: #8c8c8c;
  display: block;
  margin-top: 8rpx;
}

.record-details {
  display: flex;
  gap: 32rpx;
  margin-top: 8rpx;
}

.record-detail {
  font-size: 24rpx;
  color: #8c8c8c;
}

.record-time {
  font-size: 24rpx;
  color: #8c8c8c;
  display: block;
  margin-top: 8rpx;
}

.status-tag {
  height: 44rpx;
  font-size: 20rpx;
  padding: 0 16rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending {
  background-color: #faad14;
  color: #ffffff;
}

.approved {
  background-color: #52c41a;
  color: #ffffff;
}

.tab-bar {
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.tab-text {
  font-size: 20rpx;
  margin-top: 8rpx;
}

.tab-text.active {
  color: #1677ff;
}
</style>
