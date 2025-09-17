<route lang="jsonc">
{
  "layout": "tabbar",
  "needLogin": true,
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "访客审批",
  },
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'
import { getYlfkProcessApplication } from '@/api/role'

const userStore = useUserStore()
const LoginUserId = userStore.userInfo?.userInfo?.id
const roleType = computed(() => userStore.roleType)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 待审批数据
const pendingRecords = ref([])

// 已审批数据
const approvedRecords = ref([])

// 当前选中的tab
const activeTab = ref('pending') // pending: 待审批, approved: 已审批

onShow(async () => {
  activeTab.value = 'pending'
  await getProcessList(1, 10, '0', LoginUserId)
})

async function getProcessList(pageNo: number, pageSize: number, status: string, currentLoginedUser: string) {
  const res = await getYlfkProcessApplication(pageNo, pageSize, status, currentLoginedUser)
  if (res.code === 200) {
    if (activeTab.value === 'pending') {
      pendingRecords.value = res.result.records
    }
    else {
      approvedRecords.value = res.result.records
    }
  }
}

// 切换tab
async function switchTab(tab: string) {
  activeTab.value = tab
  if (tab === 'pending') {
    await getProcessList(1, 10, '0', LoginUserId)
  }
  else {
    await getProcessList(1, 10, '1', LoginUserId)
  }
}

async function toApprove(
  applicationCode: string,
  roleType: string,
  applicationType: string,
) {
  uni.navigateTo({
    url: `/pages/visitorApplication/visitorApplication?applyId=${
      applicationCode
    }&roleType=${roleType}&applicationType=${applicationType}`,
  })
}

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

// 处理开始日期选择
function handleStartDateChange(e: any) {
  searchForm.value.startDate = e.detail.value
}

// 处理结束日期选择
function handleEndDateChange(e: any) {
  searchForm.value.endDate = e.detail.value
}
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
  const roleType = '访客'
  // 这里可以跳转到详情页面
  uni.navigateTo({
    url: `/pages/visitorApplication/visitorApplication?applyId=${record.applicationCode}&applicationType=${record.applicationName}&roleType=${roleType}`,
  })
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
// 上拉加载监听
onReachBottom(async () => {
  console.log('到底了')
})
</script>

<template>
  <view class="audit-page">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-form">
        <!-- 搜索框 -->
        <view class="search-input-wrapper">
          <view class="input-container">
            <view class="input-icon i-carbon-search" />
            <input
              v-model="searchForm.applicationNo"
              class="search-input"
              placeholder="搜索申请单号..."
              placeholder-class="input-placeholder"
            >
          </view>
        </view>

        <!-- 日期选择行 -->
        <view class="date-row">
          <picker
            mode="date"
            :value="searchForm.startDate"
            class="date-picker"
            @change="handleStartDateChange"
          >
            <view class="date-picker-wrapper">
              <text
                class="date-text"
                :class="{ placeholder: !searchForm.startDate }"
              >
                {{ searchForm.startDate || "开始日期" }}
              </text>
              <view class="date-icon i-carbon-calendar" />
            </view>
          </picker>
          <picker
            mode="date"
            :value="searchForm.endDate"
            class="date-picker"
            @change="handleEndDateChange"
          >
            <view class="date-picker-wrapper">
              <text
                class="date-text"
                :class="{ placeholder: !searchForm.endDate }"
              >
                {{ searchForm.endDate || "结束日期" }}
              </text>
              <view class="date-icon i-carbon-calendar" />
            </view>
          </picker>
        </view>

        <!-- 筛选行 -->
        <view class="filter-row">
          <picker
            :range="applicationTypes"
            range-key="label"
            :value="applicationTypeIndex"
            class="filter-picker"
            @change="handleApplicationTypeChange"
          >
            <view class="picker-wrapper">
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
            <view class="picker-wrapper">
              <text class="picker-text">
                {{ statusTypes[statusTypeIndex].label }}
              </text>
              <view class="picker-arrow i-carbon-chevron-down" />
            </view>
          </picker>

          <view class="reset-btn" @click="handleReset">
            重置
          </view>
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
          @click="
            toApprove(record.applicationCode, roleType, record.applicationName)
          "
        >
          <view class="item-header">
            <text class="item-id">申请单号: {{ record.applicationCode }}</text>
          </view>

          <view class="item-content">
            <view class="visitor-name">
              {{ record.user }}
            </view>
            <view class="visitor-info">
              <text class="info-text">身份证号: {{ record.idCard }}</text>
            </view>
            <view class="visitor-info">
              <text class="info-text">
                申请类型: {{ record.applicationTypeName }}
              </text>
            </view>
            <view class="visitor-info">
              <text class="info-text">申请时间: {{ record.createTime }}</text>
            </view>
          </view>

          <view class="item-actions">
            <view class="approve-btn" @click="handleApprove(record)">
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
          @click="handleView(record)"
        >
          <view class="item-header">
            <text class="item-id">申请单号: {{ record.applicationCode }}</text>
            <view
              class="status-tag"
              :class="getStatusClass(record.applicationStatus)"
            >
              {{ record.applicationStatus }}
            </view>
          </view>

          <view class="item-content">
            <view class="visitor-name">
              {{ record.user }}
            </view>
            <view class="visitor-info">
              <text class="info-text">身份证号: {{ record.idCard }}</text>
            </view>
            <view class="visitor-info">
              <text class="info-text">
                申请类型: {{ record.applicationTypeName }}
              </text>
            </view>
            <view class="visitor-info">
              <text class="info-text">审批时间: {{ record.updateTime }}</text>
            </view>
          </view>

          <view class="item-actions">
            <view class="view-btn">
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40rpx 32rpx;
  border-bottom: 1rpx solid #e2e8f0;

  .search-form {
    .search-input-wrapper {
      margin-bottom: 32rpx;

      .input-container {
        display: flex;
        align-items: center;
        height: 96rpx;
        background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
        border: 2rpx solid #e2e8f0;
        border-radius: 24rpx;
        padding: 0 28rpx;
        box-shadow:
          0 4rpx 12rpx rgba(0, 0, 0, 0.05),
          inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:focus-within {
          border-color: #1890ff;
          background: #ffffff;
          box-shadow:
            0 6rpx 20rpx rgba(24, 144, 255, 0.15),
            inset 0 2rpx 4rpx rgba(255, 255, 255, 0.9);
          transform: translateY(-1rpx);

          .input-icon {
            color: #1890ff;
            transform: scale(1.1);
          }
        }

        .input-icon {
          width: 36rpx;
          height: 36rpx;
          color: #64748b;
          margin-right: 16rpx;
          transition: all 0.3s ease;
        }

        .search-input {
          flex: 1;
          font-size: 30rpx;
          color: #334155;
          font-weight: 500;
          background: transparent;
          border: none;
          outline: none;
        }

        .input-placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      }
    }

    .date-row {
      display: flex;
      gap: 20rpx;
      margin-bottom: 32rpx;

      .date-picker {
        flex: 1;

        .date-picker-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 96rpx;
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border: 2rpx solid #e2e8f0;
          border-radius: 24rpx;
          padding: 0 28rpx;
          box-shadow:
            0 4rpx 12rpx rgba(0, 0, 0, 0.05),
            inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.1), transparent);
            transition: left 0.6s ease;
          }

          &:active::before {
            left: 100%;
          }

          &:active {
            transform: translateY(1rpx);
            border-color: #1890ff;
            box-shadow:
              0 2rpx 8rpx rgba(24, 144, 255, 0.15),
              inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8);
          }

          .date-text {
            font-size: 30rpx;
            color: #334155;
            font-weight: 500;

            &.placeholder {
              color: #94a3b8;
              font-weight: 400;
            }
          }

          .date-icon {
            width: 28rpx;
            height: 28rpx;
            color: #64748b;
            transition: all 0.3s ease;
          }
        }
      }
    }

    .filter-row {
      display: flex;
      gap: 20rpx;
      align-items: center;

      .filter-picker {
        flex: 1;

        .picker-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 96rpx;
          padding: 0 28rpx;
          border-radius: 24rpx;
          border: 2rpx solid #e2e8f0;
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          box-shadow:
            0 4rpx 12rpx rgba(0, 0, 0, 0.05),
            inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.1), transparent);
            transition: left 0.6s ease;
          }

          &:active::before {
            left: 100%;
          }

          &:active {
            transform: translateY(1rpx);
            border-color: #1890ff;
            box-shadow:
              0 2rpx 8rpx rgba(24, 144, 255, 0.15),
              inset 0 2rpx 4rpx rgba(255, 255, 255, 0.8);
          }

          .picker-text {
            font-size: 26rpx;
            color: #334155;
            font-weight: 500;
          }

          .picker-arrow {
            width: 28rpx;
            height: 28rpx;
            color: #64748b;
            transition: all 0.3s ease;
          }
        }
      }

      .reset-btn {
        height: 96rpx;
        padding: 0 36rpx;
        border-radius: 24rpx;
        background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        color: #ffffff;
        font-weight: 600;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 6rpx 16rpx rgba(100, 116, 139, 0.3),
          inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        &:active {
          transform: translateY(2rpx);
          box-shadow: 0 2rpx 8rpx rgba(100, 116, 139, 0.4);

          &::before {
            left: 100%;
          }
        }
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
</style>
