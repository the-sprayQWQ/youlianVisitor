<script lang="ts" setup>
import type * as visitor from '../../interface/visitorApplicationInterface'
import { ref } from 'vue'
import { getAllDepartment } from '../../api/sys'

const props = defineProps({
  applyId: {
    type: String,
  },
})

const form = defineModel('form', {
  type: Object,
  required: true,
})
onLoad(async () => {
  await getDepartList()
})
const vehicleOptions = ref<visitor.VehicleOption[]>([
  { label: '是', value: '是' },
  { label: '否', value: '否' },
])
const departments = ref<visitor.Department[]>([])
const selectedVehicle = ref<visitor.VehicleOption>(vehicleOptions.value[0])
const selectedDepartment = ref<visitor.Department>(departments.value[0])

function onVehicleChange(e: any) {
  selectedVehicle.value = vehicleOptions.value[e.detail.value]
  form.value.isCard = vehicleOptions.value[e.detail.value].value
}

function updateParticipantCards(e: any) {
  if (e.target.value === '0') {
    console.log(e.target.value)
    uni.showToast({
      title: '参与人员至少为1',
      icon: 'none',
    })
    e.target.value = 1
  }
  else if (e.target.value > form.value.ylfkApplicationUserList.length) {
    const count = e.target.value - form.value.ylfkApplicationUserList.length
    const newItem = Array.from({ length: count }, () => ({
      applicationCode: '',
      name: '',
      phone: '',
      cardType: '',
      idCard: '',
      createBy: '',
      createTime: '',
      updateBy: '',
      updateTime: '',
      visitorNumber: '',
      carNumber: '',
      applicationStatus: '',
      enterTime: '',
      leaveTime: '',
    }))
    form.value.ylfkApplicationUserList.push(...newItem)
  }
  else if (e.target.value < form.value.ylfkApplicationUserList.length) {
    form.value.ylfkApplicationUserList.splice(e.target.value, form.value.ylfkApplicationUserList.length - e.target.value)
  }
}

function onDepartmentChange(e: any) {
  selectedDepartment.value = departments.value[e.detail.value]
}

function formatTimeStamp(timeStamp: number) {
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function handleConfirm({ value }) {
  form.value.startTime = formatTimeStamp(value[0])
  form.value.endTime = formatTimeStamp(value[1])
}
const value = ref<number[]>([])

async function getDepartList() {
  const res = await getAllDepartment()
  if (res.result) {
    console.log(res.result)
    departments.value = res.result.map(item => ({
      label: item,
      value: item,
    }))
    console.log(departments.value, 'departments')
  }
}
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
          <wd-datetime-picker
            v-model="value"
            ellipsis
            :close-on-click-modal="false"
            @confirm="handleConfirm"
          />
        </view>
      </view>
    </view>

    <view class="form-grid">
      <view class="form-item">
        <text class="form-label required">申请单位</text>
        <input
          v-model="form.applicationDept"
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
          v-model="form.visitorUser"
          class="form-input"
          type="text"
          placeholder="请输入联系人"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">联系人电话</text>
        <input
          v-model="form.visitorPhone"
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
          v-model="form.remark"
          class="form-input"
          type="text"
          placeholder="请输入交流内容"
        >
      </view>
      <view class="form-item">
        <text class="form-label required">参与人数</text>
        <input
          v-model="form.joinUserNum"
          class="form-input"
          type="number"
          placeholder="请输入参与人数"
          @blur="updateParticipantCards"
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
      <view v-if="form.isCard === '是'" class="form-item">
        <text class="form-label required">车牌号</text>
        <input
          v-model="form.carCode"
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
          v-for="(participant, index) in form.ylfkApplicationUserList"
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
    .calendar-wrapper {
      width: 340rpx;
    }
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
