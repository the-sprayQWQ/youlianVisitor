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
const activeTab = ref(0)

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
}

// 审批方法
function handleApprove(item: any) {
  console.log('审批', item)
}

// 详情方法
function handleDetail(item: any) {
  console.log('详情', item)
}
</script>

<template>
  <view class="visitor-management">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-form">
        <view class="form-row">
          <wd-input
            v-model="searchForm.date"
            placeholder="yyyy/mm/日"
            class="form-input"
          />
          <wd-input
            v-model="searchForm.name"
            placeholder="姓名"
            class="form-input"
          />
        </view>
        <view class="form-row">
          <wd-input
            v-model="searchForm.phone"
            placeholder="申请单号"
            class="form-input"
          />
          <wd-input
            v-model="searchForm.idCard"
            placeholder="身份证号"
            class="form-input"
          />
        </view>
        <wd-button
          type="primary"
          block
          class="search-btn"
          @click="handleSearch"
        >
          <view i-carbon-search class="search-icon" />
          搜索
        </wd-button>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-section">
      <wd-tabs v-model="activeTab" class="tabs">
        <wd-tab title="待审核 (2)" name="0" />
        <wd-tab title="在厂访客 (2)" name="1" />
      </wd-tabs>
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
          <wd-button
            type="warning"
            size="small"
            round
            class="detail-btn"
            @click="handleDetail(item)"
          >
            待审核
          </wd-button>
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
          <wd-button
            type="primary"
            size="small"
            class="action-btn"
            @click="handleApprove(item)"
          >
            <view i-carbon-checkmark class="btn-icon" />
            审批
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.visitor-management {
  min-height: 100vh;
  background-color: #f5f5f5;
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
      height: 88rpx;
      border-radius: 8rpx;
      font-size: 32rpx;

      .search-icon {
        font-size: 36rpx;
      }
    }
  }
}

.tab-section {
  background-color: #fff;

  .tabs {
    :deep(.wd-tabs__nav) {
      padding: 0 32rpx;
    }

    :deep(.wd-tab) {
      font-size: 30rpx;
      font-weight: 500;
    }

    :deep(.wd-tab--active) {
      color: #4285f4;
    }

    :deep(.wd-tabs__line) {
      background-color: #4285f4;
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
        font-size: 24rpx;
        padding: 8rpx 20rpx;
        height: auto;
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
        font-size: 28rpx;
        padding: 16rpx 32rpx;
        height: auto;
        border-radius: 8rpx;

        .btn-icon {
          font-size: 32rpx;
        }
      }
    }
  }
}

// 深度选择器样式调整
:deep(.wd-input) {
  .wd-input__inner {
    height: 88rpx;
    border-radius: 8rpx;
    border: 2rpx solid #e5e5e5;
    font-size: 28rpx;

    &::placeholder {
      color: #999;
    }

    &:focus {
      border-color: #4285f4;
    }
  }
}

:deep(.wd-button) {
  border-radius: 8rpx;

  &.wd-button--primary {
    background-color: #4285f4;
    border-color: #4285f4;
  }

  &.wd-button--warning {
    background-color: #ff9500;
    border-color: #ff9500;
  }
}
</style>
