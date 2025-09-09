<script lang="ts" setup>
import type * as visitor from '../../interface/visitorApplicationInterface'
import { reactive, ref } from 'vue'

const props = defineProps({
  applyId: {
    type: String,
  },
})

const form = defineModel('form', {
  type: Object,
  required: true,
})

const vehicleOptions = ref<visitor.VehicleOption[]>([
  { label: '是', value: true },
  { label: '否', value: false },
])
const departments = ref<visitor.Department[]>([
  { label: '经营部', value: 'operation' },
  { label: '人事部', value: 'hr' },
  { label: '财务部', value: 'finance' },
  { label: '技术部', value: 'tech' },
])
const selectedVehicle = ref<visitor.VehicleOption>(vehicleOptions.value[0])
const selectedDepartment = ref<visitor.Department>(departments.value[0])
const participantCount = ref<number>(2)

const formData = reactive<visitor.FormData>({
  applicant: '',
  phone: '',
  idCard: '',
  dateRange: '2025-10-02 ~ 2025-10-10',
  company: '',
  contactPerson: '',
  contactPhone: '12345678998',
  content: '',
  hasVehicle: true,
  licensePlate: '浙B66766',
  participants: [
    { name: '', idCard: '' },
    { name: '', idCard: '' },
  ],
})

function onVehicleChange(e: any) {
  selectedVehicle.value = vehicleOptions.value[e.detail.value]
  formData.hasVehicle = selectedVehicle.value.value
}

function onDateChange(e: any) {
  formData.dateRange = e.detail.value
}

function updateParticipantCards() {
  const count = Number.parseInt(participantCount.value.toString())
  const currentCount = formData.participants.length

  if (count > currentCount) {
    for (let i = currentCount; i < count; i++) {
      formData.participants.push({ name: '', idCard: '' })
    }
  }
  else if (count < currentCount) {
    formData.participants.splice(count)
  }
}

function onDepartmentChange(e: any) {
  selectedDepartment.value = departments.value[e.detail.value]
}

function handleConfirm({ value }) {
  console.log(value[0], '开始时间戳')
  console.log(value[1], '结束时间戳')
  form.value.startTime = value[0]
}
const value = ref<number[]>([])
</script>

<template>
  <view class="form-section">
    <view class="form-grid">
      <view class="form-item">
        <text class="form-label required">申请人</text>
        <input
          v-model="form.user"
          class="form-input"
          type="text"
          placeholder="请输入姓名"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">联系电话</text>
        <input
          v-model="form.phone"
          class="form-input"
          type="tel"
          placeholder="请输入电话"
        >
      </view>
    </view>

    <view class="form-grid">
      <view class="form-item">
        <text class="form-label required">身份证号</text>
        <input
          v-model="form.idCard"
          class="form-input"
          type="text"
          placeholder="请输入身份证号"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">起止时间</text>
        <view class="calendar-wrapper">
          <wd-datetime-picker v-model="value" :close-on-click-modal="false" @confirm="handleConfirm" />
        </view>
      </view>
    </view>

    <view class="form-grid">
      <view class="form-item">
        <text class="form-label required">申请单位</text>
        <input
          v-model="formData.company"
          class="form-input"
          type="text"
          placeholder="请输入单位名称"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">拜访部门</text>
        <picker
          mode="selector"
          :range="departments"
          range-key="label"
          @change="onDepartmentChange"
        >
          <view class="select-input">
            <text>{{ selectedDepartment.label }}</text>
          </view>
        </picker>
      </view>
    </view>

    <view class="form-grid">
      <view class="form-item">
        <text class="form-label required">联系人</text>
        <input
          v-model="formData.contactPerson"
          class="form-input"
          type="text"
          placeholder="请输入联系人"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">联系人电话</text>
        <input
          v-model="formData.contactPhone"
          class="form-input"
          type="tel"
          placeholder="请输入电话"
        >
      </view>
    </view>

    <view class="form-grid">
      <view class="form-item">
        <text class="form-label">交流内容</text>
        <input
          v-model="formData.content"
          class="form-input"
          type="text"
          placeholder="请输入交流内容"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">参与人数</text>
        <input
          v-model="participantCount"
          class="form-input"
          type="number"
          @input="updateParticipantCards"
        >
      </view>
    </view>

    <view class="form-grid">
      <view class="form-item">
        <text class="form-label required">是否有随行车辆</text>
        <picker
          mode="selector"
          :range="vehicleOptions"
          range-key="label"
          @change="onVehicleChange"
        >
          <view class="select-input">
            <text>{{ selectedVehicle.label }}</text>
          </view>
        </picker>
      </view>
      <view v-if="formData.hasVehicle" class="form-item">
        <text class="form-label required">车牌号</text>
        <input
          v-model="formData.licensePlate"
          class="form-input"
          type="text"
          placeholder="请输入车牌号"
        >
      </view>
    </view>

    <view class="form-group" :class="{ 'pb-12': props.applyId === '' }">
      <text class="form-label required">同行人员信息</text>
      <view class="participant-cards">
        <view
          v-for="(participant, index) in formData.participants"
          :key="index"
          class="participant-card"
        >
          <view class="card-row">
            <text class="form-label required">姓名</text>
            <input
              v-model="participant.name"
              class="form-input"
              type="text"
              placeholder="请输入姓名"
            >
          </view>
          <view class="card-row">
            <text class="form-label required">身份证号</text>
            <input
              v-model="participant.idCard"
              class="form-input"
              type="text"
              placeholder="请输入身份证号"
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  ::v-deep .wd-datetime-picker {
  border: none;
}
.form {
  &-section {
    padding: 24rpx;
    padding-top: 0;
    padding-bottom: 0;
  }

  &-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }
  &-row-number {
    display: flex;
    justify-content: space-between;
    // width: 650rpx;
    margin: 0 auto;
    height: 80rpx;
    background-color: #f9fafb;
    border: 1px solid #f9fafb;
    align-items: center;
    border-radius: 20rpx;
    margin-bottom: 10rpx;
    & .form-label {
      font-size: 14px;
      color: #8b97a7;
      margin-left: 20rpx;
    }
    & .form-value {
      font-size: 14px;
      color: #8b97a7;
      margin-right: 20rpx;
    }
  }

  &-label {
    font-size: 14px;
    color: #4e5969;
  }

  &-value {
    font-size: 14px;
  }

  &-group {
    margin-bottom: 24rpx;
  }

  &-grid {
    display: flex;
    gap: 20rpx; // 保持你原有的40rpx间距
    margin-bottom: 16rpx;
  }

  &-item {
    flex: 1;
  }

  &-input {
    height: 64rpx;
    border: 1px solid #e5e7eb;
    border-radius: 4rpx;
    padding: 0 24rpx;
    font-size: 14px;
    color: #1d2129;
    width: 100%;
    box-sizing: border-box; // 确保padding不影响总宽度
    z-index: 1;
  }
}
.select {
  &-wrapper {
    position: relative;
  }

  &-input {
    height: 64rpx;
    border: 1px solid #e5e7eb;
    border-radius: 4rpx;
    padding: 0 24rpx;
    font-size: 14px;
    color: #1d2129;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box; // 确保宽度一致
  }
}
.card-row {
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}
.participant {
  &-cards {
    margin-top: 16rpx;
  }

  &-card {
    background-color: #f5f7fa;
    border-radius: 8rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
  }
}
.required {
  &::after {
    content: '*';
    color: #ff4d4f;
    margin-left: 4rpx;
  }
}
</style>
