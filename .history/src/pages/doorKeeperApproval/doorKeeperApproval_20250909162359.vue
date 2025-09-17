<route lang="json">
{
  "layout": "tabbar",
  "needLogin": true,
  "style": {
    "navigationStyle": "default",
    "navigationBarTitleText": "访客管理"
  }
}
</route>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getYlfkProcessApplication } from '@/api/role'

const userStore = useUserStore()
const LoginUserId = userStore.userInfo?.userInfo?.id
const roleType = userStore.roleType

// 搜索表单数据
const searchForm = ref({
  date: '',
  name: '',
  phone: '',
  idCard: '',
})

// 当前激活的tab
const activeTab = ref(0)

const approvalList = ref([])
// 根据当前tab筛选访客列表
const visitorList = computed(() => {
  if (activeTab.value === 0) {
    // 待审核
    return approvalList.value
  }
  return approvalList.value
})

// 获取访客列表
async function getVisitorList() {
  const res = await getYlfkProcessApplication('0', LoginUserId)
  if (res.code === 200) {
    console.log(res)
    approvalList.value = []
    approvalList.value = res.result.records
  }
}

onShow(async () => {
  await getVisitorList()
})
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
function toApproval(applyId: string, applicationType: string) {
  uni.navigateTo({
    url: `/pages/visitorApplication/visitorApplication?applyId=${applyId}&applicationType=${applicationType}&roleType=${roleType}`,
  })
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
        <wd-tab :title="`待审核 (${approvalList.length})`" :name="0" />
        <wd-tab title="在厂访客 (2)" :name="1" />
      </wd-tabs>
    </view>

    <!-- 访客列表 -->
    <view class="visitor-list">
      <door-keeper-list
        :visitor-list="visitorList"
        :current-status="activeTab === 0 ? 'waiting' : 'approved'"
        @to-approval="toApproval"
      />
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
