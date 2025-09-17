<route lang="jsonc">
{
  "layout": "tabbar",
  "needLogin": true,
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "访客审批",
  }
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'

// 搜索表单数据
const searchForm = ref({
  applicationNo: '',
  startDate: '',
  endDate: '',
  applicationType: '',
  status: '',
})

// 申请类型选项
const applicationTypes = [
  { label: '全部申请类型', value: '' },
  { label: '业务洽谈', value: '业务洽谈' },
  { label: '学习交流', value: '学习交流' },
  { label: '参观访问', value: '参观访问' },
  { label: '技术支持', value: '技术支持' },
]

// 状态选项
const statusTypes = [
  { label: '全部状态', value: '' },
  { label: '待审批', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
]

const applicationTypeIndex = ref(0)
const statusTypeIndex = ref(0)

// 当前选中的tab
const activeTab = ref('pending') // pending: 待审批, approved: 已审批

// 待审批数据
const pendingRecords = ref([
  {
    id: '20250808001',
    name: '张明远',
    idCard: '3101*********4396',
    applicationType: '业务洽谈',
    applyTime: '2025-08-08 14:00',
  },
  {
    id: '20250808002',
    name: '李思颖',
    idCard: '4401*********7625',
    applicationType: '学习交流',
    applyTime: '2025-08-09 10:30',
  },
  {
    id: '20250808003',
    name: '王建国',
    idCard: '1101*********4517',
    applicationType: '业务洽谈',
    applyTime: '2025-08-09 15:10',
  },
])

// 已审批数据
const approvedRecords = ref([
  {
    id: '20250807001',
    name: '陈志强',
    idCard: '3205*********6891',
    applicationType: '业务洽谈',
    approveTime: '2025-08-07 16:30',
    status: 'approved',
    statusText: '已通过',
  },
  {
    id: '20250807002',
    name: '赵丽晴',
    idCard: '3301*********9263',
    applicationType: '业务洽谈',
    approveTime: '2025-08-07 11:45',
    status: 'approved',
    statusText: '已通过',
  },
  {
    id: '20250807003',
    name: '刘伟',
    idCard: '4201*********7418',
    applicationType: '学习交流',
    approveTime: '2025-08-07 15:10',
    status: 'rejected',
    statusText: '已拒绝',
  },
])

// 处理申请类型选择
function handleApplicationTypeChange(e: any) {
  applicationTypeIndex.value = e.detail.value
  searchForm.value.applicationType = applicationTypes[e.detail.value].value
}

// 处理状态选择
function handleStatusTypeChange(e: any) {
  statusTypeIndex.value = e.detail.value
  searchForm.value.status = statusTypes[e.detail.value].value
}

// 重置搜索
function handleReset() {
  searchForm.value = {
    applicationNo: '',
    startDate: '',
    endDate: '',
    applicationType: '',
    status: '',
  }
  applicationTypeIndex.value = 0
  statusTypeIndex.value = 0
}

// 切换tab
function switchTab(tab: string) {
  activeTab.value = tab
}

// 审批操作
function handleApprove(record: any) {
  console.log('审批通过:', record)
  uni.showToast({
    title: '审批成功',
    icon: 'success',
  })
}

// 查看详情
function handleView(record: any) {
  console.log('查看详情:', record)
  // 这里可以跳转到详情页面
}

// 获取状态样式类
function getStatusClass(status: string) {
  switch (status) {
    case 'approved':
      return 'status-approved'
    case 'rejected':
      return 'status-rejected'
    default:
      return 'status-default'
  }
}
</script>

<template>
  <view class="audit-page">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-form">
        <!-- 搜索框 -->
        <view class="search-input">
          <wd-input
            v-model="searchForm.applicationNo"
            placeholder="搜索申请单号..."
            class="form-input"
            clearable
          >
            <template #suffix>
              <view class="i-carbon-search search-icon" />
            </template>
          </wd-input>
        </view>

        <!-- 日期和筛选 -->
        <view class="filter-row">
          <wd-input
            v-model="searchForm.startDate"
            placeholder="开始日期"
            class="date-input"
            clearable
          />
          <wd-input
            v-model="searchForm.endDate"
            placeholder="结束日期"
            class="date-input"
            clearable
          />
        </view>

        <view class="filter-row">
          <picker
            :range="applicationTypes"
            range-key="label"
            :value="applicationTypeIndex"
            class="filter-picker"
            @change="handleApplicationTypeChange"
          >
            <view class="picker-input">
              <text class="picker-text">
                {{ applicationTypes[applicationTypeIndex].label }}
              </text>
              <view class="picker-arrow i-carbon-chevron-down" />
            </view>
          </picker>

          <picker
            :range="statusTypes"
            range-key="label"
            :value="statusTypeIndex"
            class="filter-picker"
            @change="handleStatusTypeChange"
          >
            <view class="picker-input">
              <text class="picker-text">
                {{ statusTypes[statusTypeIndex].label }}
              </text>
              <view class="picker-arrow i-carbon-chevron-down" />
            </view>
          </picker>

          <wd-button
            type="info"
            size="small"
            class="reset-btn"
            @click="handleReset"
          >
            重置
          </wd-button>
        </view>
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-section">
      <view class="tab-container">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'pending' }"
          @click="switchTab('pending')"
        >
          <text class="tab-text">待审批</text>
          <view v-if="activeTab === 'pending'" class="tab-line" />
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'approved' }"
          @click="switchTab('approved')"
        >
          <text class="tab-text">已审批</text>
          <view v-if="activeTab === 'approved'" class="tab-line" />
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="records-list">
      <!-- 待审批列表 -->
      <view v-show="activeTab === 'pending'" class="records-container">
        <view
          v-for="record in pendingRecords"
          :key="record.id"
          class="record-item"
        >
          <view class="item-header">
            <text class="item-id">申请单号: {{ record.id }}</text>
          </view>

          <view class="item-content">
            <view class="visitor-name">
              {{ record.name }}
            </view>
            <view class="visitor-info">
              <text class="info-text">身份证号: {{ record.idCard }}</text>
            </view>
            <view class="visitor-info">
              <text class="info-text">申请类型: {{ record.applicationType }}</text>
            </view>
            <view class="visitor-info">
              <text class="info-text">申请时间: {{ record.applyTime }}</text>
            </view>
          </view>

          <view class="item-actions">
            <view
              class="approve-btn"
              @click="handleApprove(record)"
            >
              审批
            </view>
          </view>
        </view>

        <!-- 暂无数据 -->
        <view v-if="pendingRecords.length === 0" class="empty-state">
          <view class="empty-icon">
            <view class="i-carbon-document-blank empty-icon-img" />
          </view>
          <text class="empty-text">暂无待审批记录</text>
        </view>
      </view>

      <!-- 已审批列表 -->
      <view v-show="activeTab === 'approved'" class="records-container">
        <view
          v-for="record in approvedRecords"
          :key="record.id"
          class="record-item"
        >
          <view class="item-header">
            <text class="item-id">申请单号: {{ record.id }}</text>
            <view class="status-tag" :class="getStatusClass(record.status)">
              {{ record.statusText }}
            </view>
          </view>

          <view class="item-content">
            <view class="visitor-name">
              {{ record.name }}
            </view>
            <view class="visitor-info">
              <text class="info-text">身份证号: {{ record.idCard }}</text>
            </view>
            <view class="visitor-info">
              <text class="info-text">申请类型: {{ record.applicationType }}</text>
            </view>
            <view class="visitor-info">
              <text class="info-text">审批时间: {{ record.approveTime }}</text>
            </view>
          </view>

          <view class="item-actions">
            <view
              class="view-btn"
            >
              查看
            </view>
          </view>
        </view>

        <!-- 暂无数据 -->
        <view v-if="approvedRecords.length === 0" class="empty-state">
          <view class="empty-icon">
            <view class="i-carbon-document-blank empty-icon-img" />
          </view>
          <text class="empty-text">暂无已审批记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.audit-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 120rpx;
}

.search-section {
  background-color: #fff;
  padding: 32rpx;

  .search-form {
    .search-input {
      margin-bottom: 24rpx;
    }

    .filter-row {
      display: flex;
      gap: 16rpx;
      margin-bottom: 24rpx;
      align-items: center;

      .date-input {
        flex: 1;
      }

      .filter-picker {
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

      .reset-btn {
        height: 88rpx;
        padding: 0 32rpx;
        border-radius: 16rpx;
        flex-shrink: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.tab-section {
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .tab-container {
    display: flex;
    padding: 0 32rpx;

    .tab-item {
      flex: 1;
      position: relative;
      padding: 32rpx 0;
      text-align: center;
      cursor: pointer;

      .tab-text {
        font-size: 32rpx;
        color: #666;
        font-weight: 400;
        transition: all 0.3s ease;
      }

      &.active {
        .tab-text {
          color: #1890ff;
          font-weight: 600;
        }
      }

      .tab-line {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 6rpx;
        background-color: #1890ff;
        border-radius: 3rpx;
      }
    }
  }
}

.records-list {
  padding: 24rpx 32rpx 0;

  .records-container {
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
          padding: 8rpx 16rpx;
          border-radius: 35rpx;
          font-size: 22rpx;
          font-weight: 500;
          min-width: 80rpx;
          height: 44rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          &.status-approved {
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          }

          &.status-rejected {
            background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
          }
        }
      }

      .item-content {
        margin-bottom: 32rpx;

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
        gap: 16rpx;

        .approve-btn {
          height: 64rpx;
          padding: 0 32rpx;
          border-radius: 8rpx;
          font-size: 28rpx;
          font-weight: 500;
          background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          &:active {
            transform: translateY(1rpx);
            opacity: 0.8;
          }
        }

        .view-btn {
          height: 64rpx;
          padding: 0 32rpx;
          border-radius: 8rpx;
          font-size: 28rpx;
          border: 2rpx solid #52c41a;
          color: #52c41a;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          &:active {
            transform: translateY(1rpx);
            background: #f6ffed;
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

    .search-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
}

:deep(.wd-button) {
  font-weight: 500;
  transition: all 0.2s ease;

  &.wd-button--info {
    background: #f5f7fa;
    color: #666;
    border-color: #e8eaed;

    &:active {
      background: #e8eaed;
    }
  }

  &.wd-button--primary {
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    border-color: transparent;

    &:active {
      transform: translateY(1rpx);
    }
  }

  &.wd-button--success {
    &.wd-button--plain {
      background: #fff;
      border-color: #52c41a;
      color: #52c41a;

      &:active {
        background: #f6ffed;
      }
    }
  }
}
</style>
