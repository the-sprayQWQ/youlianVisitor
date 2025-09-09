<route lang="jsonc" type="home">
{
  "layout": "tabbar",
  "needLogin": true,
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "访客记录"
  }
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'

// 搜索表单数据
const searchForm = ref({
  applicationNo: '',
  date: '',
  name: '',
  idCard: '',
  applicationType: '',
})

// 申请类型选项
const applicationTypes = [
  { label: '全部', value: '' },
  { label: '业务洽谈', value: '业务洽谈' },
  { label: '学习交流', value: '学习交流' },
  { label: '参观访问', value: '参观访问' },
  { label: '技术支持', value: '技术支持' },
]

const applicationTypeIndex = ref(0)

// 访客记录数据
const visitorRecords = ref([
  {
    id: '20231141001',
    name: '赵云',
    idCard: '3205*********7890',
    applicationType: '业务洽谈',
    applyTime: '2023-11-14 09:30',
    enterTime: '2023-11-14 09:30',
    leaveTime: '2023-11-14 17:30',
    status: 'left', // left: 已离厂, rejected: 已拒绝, visiting: 在厂中
    statusText: '已离厂',
  },
  {
    id: '20231141002',
    name: '孙婷',
    idCard: '3205*********4321',
    applicationType: '学习交流',
    applyTime: '2023-11-14 14:30',
    enterTime: '',
    leaveTime: '',
    status: 'rejected',
    statusText: '已拒绝',
  },
  {
    id: '20231141003',
    name: '李明',
    idCard: '3205*********6789',
    applicationType: '业务洽谈',
    applyTime: '2023-11-14 10:15',
    enterTime: '2023-11-14 10:30',
    leaveTime: '',
    status: 'visiting',
    statusText: '在厂中',
  },
])

// 处理申请类型选择
function handleApplicationTypeChange(e: any) {
  applicationTypeIndex.value = e.detail.value
  searchForm.value.applicationType = applicationTypes[e.detail.value].value
}

// 搜索方法
function handleSearch() {
  console.log('搜索条件:', searchForm.value)
  // 这里可以添加搜索逻辑
}

// 获取状态样式类
function getStatusClass(status: string) {
  switch (status) {
    case 'left':
      return 'status-left'
    case 'rejected':
      return 'status-rejected'
    case 'visiting':
      return 'status-visiting'
    default:
      return 'status-default'
  }
}
</script>

<template>
  <view class="visitor-records">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-form">
        <view class="form-row">
          <wd-input
            v-model="searchForm.applicationNo"
            placeholder="申请单号"
            class="form-input"
            clearable
          />
          <wd-input
            v-model="searchForm.date"
            placeholder="yyyy/mm/日"
            class="form-input"
            clearable
          />
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
        <view class="form-row">
          <picker
            :range="applicationTypes"
            range-key="label"
            :value="applicationTypeIndex"
            class="application-type-picker"
            @change="handleApplicationTypeChange"
          >
            <view class="picker-input">
              <text class="picker-text">
                {{ applicationTypes[applicationTypeIndex].label }}
              </text>
              <view class="picker-arrow i-carbon-chevron-down" />
            </view>
          </picker>
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

    <!-- 访客记录列表 -->
    <view class="records-list">
      <view
        v-for="record in visitorRecords"
        :key="record.id"
        class="record-item"
      >
        <!-- 申请单号和状态 -->
        <view class="item-header">
          <text class="item-id">申请单号: {{ record.id }}</text>
          <view class="status-tag" :class="getStatusClass(record.status)">
            {{ record.statusText }}
          </view>
        </view>

        <!-- 访客信息 -->
        <view class="item-content">
          <view class="visitor-name">
            {{ record.name }}
          </view>
          <view class="visitor-info">
            <text class="info-text">身份证: {{ record.idCard }}</text>
          </view>
          <view class="visitor-info">
            <text class="info-text">申请类型: {{ record.applicationType }}</text>
          </view>
          <view class="visitor-info">
            <text class="info-text">申请时间: {{ record.applyTime }}</text>
          </view>
          <view v-if="record.enterTime" class="visitor-info">
            <text class="info-text">进入时间: {{ record.enterTime }}</text>
          </view>
          <view v-if="record.leaveTime" class="visitor-info">
            <text class="info-text">离开时间: {{ record.leaveTime }}</text>
          </view>
        </view>
      </view>

      <!-- 暂无数据 -->
      <view v-if="visitorRecords.length === 0" class="empty-state">
        <view class="empty-icon">
          <view class="i-carbon-document-blank empty-icon-img" />
        </view>
        <text class="empty-text">暂无访客记录</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.visitor-records {
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

    .application-type-picker {
      flex: 1;

      .picker-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88rpx;
        padding: 0 24rpx;
        border-radius: 16rpx;
        border: 2rpx solid #e8eaed;
        background-color: #fafbfc;
        transition: all 0.2s ease;

        .picker-text {
          font-size: 30rpx;
          color: #333;
        }

        .picker-arrow {
          width: 24rpx;
          height: 24rpx;
          color: #9aa0a6;
        }
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

.records-list {
  padding: 24rpx 32rpx 0;
}

.record-item {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;

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
      color: #fff;
      padding: 4rpx 16rpx;
      border-radius: 35rpx;
      font-size: 22rpx;
      font-weight: 700;
      min-width: 80rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.status-left {
        background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
      }

      &.status-rejected {
        background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
      }

      &.status-visiting {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      }
    }
  }

  .item-content {
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
}

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
}
</style>
