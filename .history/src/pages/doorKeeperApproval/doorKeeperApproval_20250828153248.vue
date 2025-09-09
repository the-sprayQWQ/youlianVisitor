<route lang="jsonc" type="home">
{
  "layout": "tabbar",
  "needLogin": true, // 是否需要登录"
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "访客管理",
  },
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'

// 搜索表单数据
const searchForm = ref({
  date: '',
  name: '',
  phone: '',
  idCard: '',
})

// 当前激活的tab
const activeTab = ref('0')

// 访客列表数据
const visitorList = ref([
  {
    id: '20231115T001',
    name: '张伟',
    phone: '3205*********5678',
    type: '业务洽谈',
    time: '2023-11-15 09:30',
    status: 'waiting', // waiting: 待审核, approved: 在厂访客
  },
  {
    id: '20231115T002',
    name: '李源',
    phone: '3205*********2234',
    type: '学习交流',
    time: '2023-11-15 10:15',
    status: 'waiting',
  },
])

// 搜索方法
function handleSearch() {
  console.log('搜索', searchForm.value)
  uni.showToast({
    title: '搜索功能',
    icon: 'none',
  })
}

// 审批方法
function handleApprove(item: any) {
  console.log('审批', item)
  uni.showToast({
    title: '审批功能',
    icon: 'none',
  })
}

// 详情方法
function handleDetail(item: any) {
  console.log('详情', item)
  uni.showToast({
    title: '查看详情',
    icon: 'none',
  })
}
</script>

<template>
  <view class="visitor-management">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-form">
        <view class="form-row">
          <input
            v-model="searchForm.date"
            placeholder="yyyy/mm/日"
            class="form-input"
          >
          <input
            v-model="searchForm.name"
            placeholder="姓名"
            class="form-input"
          >
        </view>
        <view class="form-row">
          <input
            v-model="searchForm.phone"
            placeholder="申请单号"
            class="form-input"
          >
          <input
            v-model="searchForm.idCard"
            placeholder="身份证号"
            class="form-input"
          >
        </view>
        <button
          class="search-btn"
          @click="handleSearch"
        >
          <view class="i-mdi-magnify search-icon" />
          搜索
        </button>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-section">
      <view class="tabs">
        <button
          class="tab-btn" :class="[{ active: activeTab === '0' }]"
          @click="activeTab = '0'"
        >
          待审核 (2)
        </button>
        <button
          class="tab-btn" :class="[{ active: activeTab === '1' }]"
          @click="activeTab = '1'"
        >
          在厂访客 (2)
        </button>
      </view>
    </view>

    <!-- 访客列表 -->
    <view class="visitor-list">
      <view
        v-for="item in visitorList"
        :key="item.id"
        class="visitor-item"
      >
        <!-- 申请单号 -->
        <view class="item-header">
          <text class="item-id">申请单号: {{ item.id }}</text>
          <button
            class="detail-btn"
            @click="handleDetail(item)"
          >
            待审核
          </button>
        </view>

        <!-- 访客信息 -->
        <view class="item-content">
          <view class="visitor-name">
            {{ item.name }}
          </view>
          <view class="visitor-info">
            <text class="info-text">身份证: {{ item.phone }}</text>
          </view>
          <view class="visitor-info">
            <text class="info-text">申请类型: {{ item.type }}</text>
          </view>
          <view class="visitor-info">
            <text class="info-text">申请时间: {{ item.time }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="item-actions">
          <button
            class="action-btn"
            @click="handleApprove(item)"
          >
            <view class="i-mdi-check btn-icon" />
            审批
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.visitor-management {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; /* 为底部tabbar留空间 */
}

.search-section {
  background-color: #fff;
  padding: 32rpx;
  margin-bottom: 20rpx;

  .search-form {
    .form-row {
      display: flex;
      gap: 24rpx;
      margin-bottom: 24rpx;

      .form-input {
        flex: 1;
        height: 88rpx;
        padding: 0 24rpx;
        border: 2rpx solid #e5e5e5;
        border-radius: 8rpx;
        font-size: 28rpx;
        background-color: #fff;

        &::placeholder {
          color: #999;
        }

        &:focus {
          border-color: #4285f4;
          outline: none;
        }
      }

      &:last-of-type {
        margin-bottom: 32rpx;
      }
    }

    .search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;
      width: 100%;
      height: 88rpx;
      background-color: #4285f4;
      color: #fff;
      border: none;
      border-radius: 8rpx;
      font-size: 32rpx;

      .search-icon {
        font-size: 36rpx;
      }

      &:active {
        background-color: #3367d6;
      }
    }
  }
}

.tab-section {
  background-color: #fff;

  .tabs {
    display: flex;
    padding: 0 32rpx;

    .tab-btn {
      flex: 1;
      height: 88rpx;
      background: none;
      border: none;
      font-size: 30rpx;
      color: #666;
      position: relative;

      &.active {
        color: #4285f4;
        font-weight: 500;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 4rpx;
          background-color: #4285f4;
          border-radius: 2rpx;
        }
      }
    }
  }
}

.visitor-list {
  padding: 0 32rpx;

  .visitor-item {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;

      .item-id {
        font-size: 26rpx;
        color: #666;
      }

      .detail-btn {
        background-color: #ff9500;
        color: #fff;
        border: none;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
        font-size: 24rpx;

        &:active {
          background-color: #e6850e;
        }
      }
    }

    .item-content {
      margin-bottom: 32rpx;

      .visitor-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 16rpx;
      }

      .visitor-info {
        margin-bottom: 8rpx;

        .info-text {
          font-size: 28rpx;
          color: #666;
          line-height: 1.5;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .item-actions {
      display: flex;
      justify-content: flex-end;

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8rpx;
        background-color: #4285f4;
        color: #fff;
        border: none;
        padding: 16rpx 32rpx;
        border-radius: 8rpx;
        font-size: 28rpx;

        .btn-icon {
          font-size: 32rpx;
        }

        &:active {
          background-color: #3367d6;
        }
      }
    }
  }
}

/* 图标样式 */
.i-mdi-magnify::before {
  content: '🔍';
  font-style: normal;
}

.i-mdi-check::before {
  content: '✓';
  font-style: normal;
}
</style>
