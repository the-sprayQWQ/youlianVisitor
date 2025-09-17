<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  visitorList: [],
  currentStatus: {
    type: String,
    default: 'waiting', // waiting: 待审核, approved: 在厂访客
  },
})

// 弹窗控制
const showSignOutModal = ref(false)
const currentSignOutItem = ref(null)

// 签离表单数据
const signOutForm = ref({
  visitorCard: false,
  licensePlate: false,
})

// 根据当前状态获取标签信息
function getStatusInfo() {
  if (props.currentStatus === 'waiting') {
    return {
      text: '待审核',
      class: 'status-waiting',
    }
  }
  else {
    return {
      text: '在厂中',
      class: 'status-approved',
    }
  }
}

// 根据当前状态获取操作按钮信息
function getActionInfo() {
  if (props.currentStatus === 'waiting') {
    return {
      text: '审批',
      icon: 'i-carbon-document-requirements',
      class: 'action-approve',
    }
  }
  else {
    return {
      text: '签离',
      icon: 'i-carbon-logout',
      class: 'action-checkout',
    }
  }
}

// 处理签离按钮点击
function handleSignOut(item: any) {
  currentSignOutItem.value = item
  // 重置表单
  signOutForm.value = {
    visitorCard: false,
    licensePlate: false,
  }
  showSignOutModal.value = true
}

// 处理复选框项点击
function handleCheckboxItemClick(field: string) {
  if (field === 'visitorCard') {
    signOutForm.value.visitorCard = !signOutForm.value.visitorCard
  }
  else if (field === 'licensePlate') {
    signOutForm.value.licensePlate = !signOutForm.value.licensePlate
  }
}

// 确认签离
function confirmSignOut() {
  console.log('确认签离', {
    visitor: currentSignOutItem.value,
    form: signOutForm.value,
  })
  // 这里可以调用API进行签离操作
  showSignOutModal.value = false
}

// 取消签离
function cancelSignOut() {
  showSignOutModal.value = false
}
</script>

<template>
  <view
    v-for="item in props.visitorList"
    :key="item.applicationCode"
    class="visitor-item"
    :class="{ 'visitor-item--approved': props.currentStatus === 'approved' }"
  >
    <!-- 申请单号和状态 -->
    <view class="item-header">
      <text class="item-id">申请单号: {{ item.applicationCode }}</text>
      <view class="status-tag">
        {{ item. }}
      </view>
    </view>

    <!-- 访客信息 -->
    <view class="item-content">
      <view class="visitor-name">
        {{ item.name }}
      </view>
      <view class="visitor-info">
        <text class="info-text">身份证:{{ item.phone }}</text>
      </view>
      <view class="visitor-info">
        <text class="info-text">申请类型:{{ item.type }}</text>
      </view>
      <view class="visitor-info">
        <text class="info-text">
          {{ props.currentStatus === "approved" ? "进入时间" : "申请时间" }}:
          {{ item.time }}
        </text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="item-actions">
      <!-- 审批状态：只是显示标签 -->
      <view
        v-if="props.currentStatus === 'waiting'"
        class="action-tag action-approve"
      >
        <view :class="`${getActionInfo().icon} btn-icon`" />
        {{ getActionInfo().text }}
      </view>
      <!-- 签离状态：可点击按钮 -->
      <view
        v-else
        class="action-tag action-checkout"
        @click="handleSignOut(item)"
      >
        <view :class="`${getActionInfo().icon} btn-icon`" />
        {{ getActionInfo().text }}
      </view>
    </view>
  </view>

  <!-- 签离弹窗 -->
  <wd-popup
    v-model="showSignOutModal"
    position="center"
    :close-on-click-modal="false"
  >
    <view class="sign-out-modal">
      <!-- 装饰性顶部条 -->
      <view class="modal-decoration" />

      <view class="modal-header">
        <view class="header-icon">
          <view class="i-carbon-document-export icon" />
        </view>
        <text class="modal-title">回收访客证</text>
        <text class="modal-subtitle">请确认以下物品回收情况</text>
      </view>

      <view class="modal-content">
        <view
          class="checkbox-item"
          :class="{ 'checkbox-item--active': signOutForm.visitorCard }"
          @click="handleCheckboxItemClick('visitorCard')"
        >
          <wd-checkbox
            v-model="signOutForm.visitorCard"
            class="custom-checkbox"
          />
          <view class="item-content">
            <view class="item-icon">
              <view class="i-carbon-identification icon" />
            </view>
            <view class="item-text">
              <text class="item-label">临时访客证号</text>
              <text class="item-value">V20231115</text>
            </view>
          </view>
        </view>

        <view
          class="checkbox-item"
          :class="{ 'checkbox-item--active': signOutForm.licensePlate }"
          @click="handleCheckboxItemClick('licensePlate')"
        >
          <wd-checkbox
            v-model="signOutForm.licensePlate"
            class="custom-checkbox"
          />
          <view class="item-content">
            <view class="item-icon">
              <view class="i-carbon-car icon" />
            </view>
            <view class="item-text">
              <text class="item-label">收到车牌号</text>
              <text class="item-value">苏A88888</text>
            </view>
          </view>
        </view>
      </view>

      <view class="modal-actions">
        <wd-button class="cancel-btn" @click="cancelSignOut">
          取消
        </wd-button>
        <wd-button type="primary" class="confirm-btn" @click="confirmSignOut">
          <view class="i-carbon-checkmark btn-icon" />
          确认签离
        </wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.visitor-item {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;

  // 在厂访客状态保持普通样式

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

      // 待审核状态样式
      &.status-waiting {
        background: linear-gradient(135deg, #ff9500 0%, #ffad33 100%);
      }

      // 在厂访客状态样式
      &.status-approved {
        background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
      }
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
      color: #fff;
      padding: 10rpx 20rpx;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: pointer;

      .btn-icon {
        width: 28rpx;
        height: 28rpx;
      }

      // 审批标签样式（纯展示）
      &.action-approve {
        background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
        box-shadow: 0 4rpx 12rpx rgba(66, 133, 244, 0.2);
        cursor: default;
      }

      // 签离按钮样式（可点击）
      &.action-checkout {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
        box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
        cursor: pointer;

        &:active {
          transform: translateY(1rpx);
        }
      }
    }
  }
}

// 签离弹窗样式
.sign-out-modal {
  background: #fff;
  border-radius: 32rpx;
  padding: 0;
  width: 640rpx;
  max-width: 90vw;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);

  // 装饰性顶部条
  .modal-decoration {
    height: 8rpx;
    background: linear-gradient(135deg, #4285f4 0%, #34d399 50%, #10b981 100%);
  }

  .modal-header {
    padding: 56rpx 48rpx 40rpx;
    text-align: center;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    position: relative;

    .header-icon {
      width: 96rpx;
      height: 96rpx;
      margin: 0 auto 24rpx;
      background: linear-gradient(135deg, #4285f4 0%, #5a9bf8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 24rpx rgba(66, 133, 244, 0.3);

      .icon {
        width: 48rpx;
        height: 48rpx;
        color: #fff;
      }
    }

    .modal-title {
      font-size: 40rpx;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 16rpx;
      display: block;
    }

    .modal-subtitle {
      font-size: 28rpx;
      color: #64748b;
      font-weight: 400;
      display: block;
      line-height: 1.4;
    }
  }

  .modal-content {
    padding: 48rpx;
    background: #fff;

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 24rpx;
      margin-bottom: 40rpx;
      padding: 32rpx;
      background: linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%);
      border-radius: 24rpx;
      border: 2rpx solid #e2e8f0;
      transition: all 0.3s ease;
      cursor: pointer;
      user-select: none;

      &:last-child {
        margin-bottom: 0;
      }

      // 悬浮状态
      &:hover {
        border-color: #4285f4;
        box-shadow: 0 4rpx 16rpx rgba(66, 133, 244, 0.1);
        transform: translateY(-2rpx);
      }

      // 点击状态
      &:active {
        transform: translateY(0);
        box-shadow: 0 2rpx 8rpx rgba(66, 133, 244, 0.1);
      }

      // 选中状态
      &.checkbox-item--active {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border-color: #10b981;
        box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.15);

        .item-content .item-icon {
          background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);

          .icon {
            color: #047857;
          }
        }

        .item-content .item-text {
          .item-label {
            color: #065f46;
          }

          .item-value {
            color: #047857;
          }
        }
      }

      .custom-checkbox {
        flex-shrink: 0;
        pointer-events: none; // 禁用复选框的直接点击，通过容器统一处理
      }

      .item-content {
        display: flex;
        align-items: center;
        gap: 24rpx;
        flex: 1;
        pointer-events: none; // 防止内容区域的事件冲突

        .item-icon {
          width: 64rpx;
          height: 64rpx;
          background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
          border-radius: 16rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;

          .icon {
            width: 32rpx;
            height: 32rpx;
            color: #0277bd;
            transition: all 0.3s ease;
          }
        }

        .item-text {
          flex: 1;

          .item-label {
            display: block;
            font-size: 28rpx;
            color: #475569;
            font-weight: 500;
            margin-bottom: 8rpx;
            line-height: 1.2;
            transition: all 0.3s ease;
          }

          .item-value {
            display: block;
            font-size: 32rpx;
            color: #1e293b;
            font-weight: 600;
            line-height: 1.2;
            transition: all 0.3s ease;
          }
        }
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 32rpx;
    padding: 32rpx 48rpx 56rpx;
    background: #fff;
    justify-content: center;

    .cancel-btn,
    .confirm-btn {
      width: 200rpx;
      height: 96rpx;
      border-radius: 24rpx;
      font-size: 32rpx;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .cancel-btn {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #64748b;
      border: 2rpx solid #e2e8f0;

      &:active {
        background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
        transform: translateY(2rpx);
      }
    }

    .confirm-btn {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      border-color: transparent;
      box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;

      .btn-icon {
        width: 32rpx;
        height: 32rpx;
      }

      &:active {
        transform: translateY(2rpx);
        box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
      }
    }
  }
}

// 弹窗组件样式覆盖
:deep(.wd-popup) {
  .wd-popup__modal {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8rpx);
  }
}

// 复选框样式优化
:deep(.wd-checkbox) {
  .wd-checkbox__shape {
    width: 40rpx;
    height: 40rpx;
    border-radius: 12rpx;
    border: 3rpx solid #d1d5db;
    transition: all 0.2s ease;
  }

  &.is-checked {
    .wd-checkbox__shape {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      border-color: #10b981;
      box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
    }
  }
}
</style>
