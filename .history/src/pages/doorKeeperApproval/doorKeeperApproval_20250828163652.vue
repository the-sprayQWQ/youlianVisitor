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
            clearable
          />
          <wd-input
            v-model="searchForm.name"
            placeholder="姓名"
            class="form-input"
            clearable
          />
        </view>
        <view class="form-row">
          <wd-input
            v-model="searchForm.phone"
            placeholder="申请单号"
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
        <!-- 申请单号和状态 -->
        <view class="item-header">
          <text class="item-id">申请单号: {{ item.id }}</text>
          <view class="status-tag">
            待审核
          </view>
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
          <view class="action-tag">
            <view class="i-carbon-document-requirements btn-icon" />
            审批
          </view>
        </view>
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
  padding: 40rpx 32rpx;

  .search-form {
    .form-row {
      display: flex;
      gap: 20rpx;
      margin-bottom: 28rpx;

      .form-input {
        flex: 1;
      }

      &:last-of-type {
        margin-bottom: 40rpx;
      }
    }

    .search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16rpx;
      height: 96rpx;
      border-radius: 48rpx;
      font-size: 32rpx;
      font-weight: 500;
      background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
      box-shadow: 0 8rpx 24rpx rgba(66, 133, 244, 0.3);

      .search-icon {
        width: 36rpx;
        height: 36rpx;
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

  .visitor-item {
    background-color: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 32rpx;
    box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
    border: 1rpx solid #f0f0f0;

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32rpx;

      .item-id {
        font-size: 28rpx;
        color: #666;
        font-weight: 400;
      }

      .status-tag {
        background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%);
        color: #fff;
        padding: 4rpx 16rpx;
        border-radius: 35rpx;
        font-size: 22rpx;
        font-weight: 500;
        min-width: 80rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .item-content {
      margin-bottom: 40rpx;

      .visitor-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 24rpx;
        line-height: 1.2;
      }

      .visitor-info {
        margin-bottom: 16rpx;
        line-height: 1.5;

        .info-text {
          font-size: 30rpx;
          color: #666;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .item-actions {
      display: flex;
      justify-content: flex-end;

      .action-tag {
        display: flex;
        align-items: center;
        gap: 8rpx;
        min-width: 120rpx;
        height: 40rpx;
        font-size: 26rpx;
        font-weight: 500;
        border-radius: 8rpx;
        background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
        color: #fff;
        padding: 10rpx 20rpx;
        box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.2);
        justify-content: center;

        .btn-icon {
          width: 28rpx;
          height: 28rpx;
        }
      }
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
