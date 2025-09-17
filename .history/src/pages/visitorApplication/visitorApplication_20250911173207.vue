<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc">
{
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "访客入厂申请单",
  },
}
</route>

<script lang="ts" setup>
import type * as visitor from '../../interface/visitorApplicationInterface'
import type { IAppResult } from '@/api/sys'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { submitApplication } from '@/api/application'
import { getYlfkApplicationDetail, toApprovalApplication } from '@/api/role'
import { getApprovalResult, getSysAllUserList } from '@/api/sys'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn.vue'

const studyFormRef = ref(null)
const businessFormRef = ref(null)
const userStore = useUserStore()
const currentLoginedUser = userStore.userInfo.userInfo.id

const initData = {
  applicationCode: '',
  applicationType: '1',
  user: '',
  transUser: '',
  userOpinion: '',
  applicationResult: '',
  ylfkApplicationPage: {
    user: '',
    phone: '',
    idCard: '',
    startTime: '',
    endTime: '',
    applicationDept: '',
    visitorDept: '',
    visitorUser: '',
    visitorPhone: '',
    remark: '',
    joinUserNum: '1',
    isCard: '是',
    carCode: '',
    isGoods: '',
    carImage: '',
    goodsImage: '',
    ylfkApplicationUserList: [
      {
        name: '',
        phone: '',
        cardType: '',
        idCard: '',
        visitorNumber: '',
        applicationStatus: '',
        carNumber: '',
        enterTime: '',
        leaveTime: '',
      },
    ],
  },
  ylfkCheckApplicationPage: {
    deptName: '',
    user: '',
    idCard: '',
    phone: '',
    belongDept: '',
    allUsers: '',
    isCar: '',
    carCode: '',
    checkHaveGoodsList: [
      {
        toolName: '',
        num: '',
        isLeave: '',
      },
    ],
    checkUsersList: [
      {
        name: '',
        cardCode: '',
        phone: '',
        insurance: '',
      },
    ],
  },
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

const form = ref(deepClone(initData))

const form1 = {
  user: '',
  applicationCode: '',
  applicationType: '',
  transUser: '',
  copyUser: '',
  userOpinion: '',
  applicationResult: '',
  visitorNumber: '',
  carNumber: '',
}
const visitorTypes = ref<visitor.VisitorType[]>([
  { label: '学习交流', value: '1' },
  { label: '业务沟通', value: '0' },
])

const selectedVisitorType = ref<visitor.VisitorType>(visitorTypes.value[0])
const showDialog = ref<boolean>(false)
const showReject = ref<boolean>(false)
const showTransfer = ref<boolean>(false)
const showApproval = ref<boolean>(false)
const rejectReason = ref<string>('')

const approvals = ref<visitor.Approvals>({
  manager: false,
  leader: false,
  guard: false,
})

// 新增：控制复选框状态的变量
const approvalStatus = ref({
  managerRejected: false, // 经理是否被拒绝
  guardRejected: false, // 门卫是否被拒绝
})

async function onVisitorTypeChange(e: any) {
  selectedVisitorType.value = visitorTypes.value[e.detail.value]
  form.value.applicationType = selectedVisitorType.value.value
  if (e.target.value === '0') {
    await nextTick()
    await studyFormRef.value.getDepartList()
  }
  else {
    await nextTick()
    await businessFormRef.value.getDepartList()
  }
}

function showVisitorTypeDialog() {
  showDialog.value = true
}

function onReject() {
  showReject.value = true
}

function onTransfer() {
  showTransfer.value = true
}

function onApprove() {
  showApproval.value = true
}

const value = ref<number[]>([])

function closePopup(data) {
  console.log(data)
  showReject.value = data
}

function closeDialog(data) {
  showDialog.value = data
}

function closeTransferPopup(data) {
  showTransfer.value = data
}

const columns = ref([])
const value1 = ref('')
const isShow = ref(false)
function handleConfirm1({ value }) {
  value1.value = value
  console.log(value1.value)
}

function closeApprovalPopup() {
  showApproval.value = false
}
const applyId = ref('')
const timeStampList = ref<number[]>([])
const disable = ref(false)
const managerApp = ref(false)
const isApproval = ref(false)
const doorApp = ref(false)
const divisionApp = ref(false)
const opinionsList = ref<IAppResult['result']>([])
function getTimeStamp(dateString: string) {
  return new Date(dateString).getTime()
}

async function getAllUser() {
  const res = await getSysAllUserList()
  if (res.code === 0) {
    const tempArr = res.result.records.filter((item) => {
      return item.roles_dictText !== '访客'
    })
    columns.value = tempArr.map((item) => {
      return {
        label: item.realname,
        value: item.id,
      }
    })
  }
}
async function getResult(code: string) {
  const res = await getApprovalResult(code)
  if (res.code === 200) {
    opinionsList.value = res.result
  }
}

onLoad(async (e) => {
  await getAllUser()
  if (e.applyId && e.applyId !== 'undefined') {
    applyId.value = e.applyId
    const res = await getYlfkApplicationDetail(e.applyId, e.applicationType)
    if (res.code === 200) {
      form.value = res.result
      form1.carNumber = res.result.ylfkApplicationPage.ylfkApplicationUserList[0].carNumber
      form1.visitorNumber = res.result.ylfkApplicationPage.ylfkApplicationUserList[0].visitorNumber

      timeStampList.value = [
        getTimeStamp(form.value.ylfkApplicationPage.startTime),
        getTimeStamp(form.value.ylfkApplicationPage.endTime),
      ]
      if (form.value.applicationType === '0') {
        selectedVisitorType.value = visitorTypes.value[1]
      }
      else {
        selectedVisitorType.value = visitorTypes.value[0]
      }
    }
    if (e.roleType === '访客') {
      disable.value = true
    }
    if (e.applicationType === '0' && e.currentNode === '入厂门卫二维码检验') {
      await getResult(e.applyId)
      if (opinionsList.value[1] && opinionsList.value[1].applicatiOpinion === '同意入厂') {
        approvals.value.manager = true
      }
      else if (opinionsList.value[1] && opinionsList.value[1].applicatiOpinion === '') {
        approvals.value.manager = false
      }
      else {
        // 实现新需求：经理意见被拒绝，显示红色×复选框
        approvalStatus.value.managerRejected = true
      }
      if (opinionsList.value[2] && opinionsList.value[2].applicatiOpinion === '已阅') {
        approvals.value.guard = true
      }
      else if (opinionsList.value[2] && opinionsList.value[2].applicatiOpinion === '') {
        approvals.value.guard = false
      }
      else {
        // 实现新需求：门卫审批被拒绝，显示红色×复选框
        approvalStatus.value.guardRejected = true
      }
      isApproval.value = true
      managerApp.value = true
      doorApp.value = true
    }
    else if (e.applicationType === '0' && e.currentNode === '部门审核') {
      await getResult(e.applyId)
      isApproval.value = true
      managerApp.value = true
      // 检查部门审核结果
      // if (opinionsList.value && opinionsList.value.length > 0) {
      //   const deptApproval = opinionsList.value.find(item => item.nodeName === '部门审核')
      //   if (deptApproval && deptApproval.applicatiOpinion !== '同意入厂') {
      //     approvalStatus.value.managerRejected = true
      //   }
      // }
    }
  }

  if (e.roleType === '访客') {
    console.log('进入访客分支')
    isShow.value = false
  }
  else if (e.roleType === '部门审核') {
    await getResult(e.applyId)
    disable.value = true
    isApproval.value = true
    managerApp.value = true
    if (e.view === 'true') {
      isShow.value = false
      const tempArr = opinionsList.value.filter(
        item => item.nodeName === e.roleType,
      )
      if (tempArr[0] && tempArr[0].applicatiOpinion === '同意入厂') {
        approvals.value.manager = true
      }
      else if (tempArr[0]) {
        // 添加部门审核拒绝的处理
        approvalStatus.value.managerRejected = true
      }
    }
    else {
      isShow.value = true
    }
  }
  else if (e.roleType === '门卫') {
    disable.value = true
    doorApp.value = true
    isApproval.value = true
    isShow.value = true
  }
  else {
    isShow.value = true
  }
})

async function submit() {
  console.log(form.value)
  const res = await submitApplication(form.value)
  if (res.code === 200) {
    uni.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000,
    })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 2000)
  }
}

async function Approval(form) {
  const res = await toApprovalApplication(form)
  if (res.code === 200) {
    uni.switchTab({
      url: '/pages/audit/audit',
    })
  }
}

async function confirmApproval() {
  form1.user = currentLoginedUser
  form1.applicationCode = applyId.value
  if (approvals.value.manager === true) {
    form1.userOpinion = '同意入厂'
  }
  else if (approvals.value.guard === true) {
    form1.userOpinion = '已阅'
  }
  form1.copyUser = value1.value
  form1.applicationResult = '0'
  await Approval(form1)
}
async function confirmReject() {
  form1.user = currentLoginedUser
  form1.applicationCode = applyId.value
  form1.userOpinion = rejectReason.value
  form1.applicationResult = '1'
  await Approval(form1)
}

async function confirmTranfer() {
  form1.user = currentLoginedUser
  form1.applicationCode = applyId.value
  form1.transUser = value1.value
  form1.applicationResult = '2'
  await Approval(form1)
}
</script>

<template>
  <view class="container">
    <view class="box-border p-3">
      <view v-if="applyId" class="form-row-number">
        <text class="form-label">申请单号</text>
        <text class="form-value text-primary">{{ applyId }}</text>
      </view>

      <!-- 访客类型 -->
      <view class="form-group">
        <view class="form-row">
          <text class="form-label required">访客类型</text>
          <view i-tabler:help @click="showVisitorTypeDialog" />
        </view>
        <view class="select-wrapper">
          <picker
            mode="selector"
            :range="visitorTypes"
            range-key="label"
            :disabled="disable"
            @change="onVisitorTypeChange"
          >
            <view class="select-input">
              <text>{{ selectedVisitorType.label }}</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 主体部分 -->
    <scroll-view class="content" scroll-y>
      <study-form
        v-show="selectedVisitorType.value === '1'"
        ref="studyFormRef"
        :form="form"
        :apply-id="applyId"
        :disabled="disable"
        :value="timeStampList"
      />
      <business-form
        v-show="selectedVisitorType.value === '0'"
        ref="businessFormRef"
        :disabled="disable"
        :apply-id="applyId"
        :form="form"
        :value="timeStampList"
      />
    </scroll-view>

    <!-- 审批框 -->
    <view v-if="applyId && isApproval" class="mb-12 box-border p-3">
      <view class="approval-section">
        <view v-if="managerApp" class="approval-item">
          <text class="approval-title">经理意见</text>
          <label class="approval-checkbox">
            <!-- 根据状态显示不同的复选框 -->
            <wd-checkbox
              v-if="!approvalStatus.managerRejected"
              v-model="approvals.manager"
            >
              同意入厂
            </wd-checkbox>
            <!-- 新增：红色×复选框 -->
            <view
              v-else
              class="approval-checkbox-rejected"
            >
              <view class="checkbox-rejected">
                <text class="reject-icon">×</text>
              </view>
              <text class="approval-text-rejected">未通过</text>
            </view>
          </label>
        </view>

        <view v-if="divisionApp" class="approval-item">
          <text class="approval-title">分管领导意见</text>
          <label class="approval-checkbox">
            <wd-checkbox v-model="approvals.leader"> 同意入厂 </wd-checkbox>
          </label>
        </view>

        <view v-if="doorApp" class="approval-item-extra">
          <view style="display: flex; justify-content: space-between">
            <text class="approval-title">门卫审批</text>
            <label class="approval-checkbox">
              <!-- 根据状态显示不同的复选框 -->
              <wd-checkbox
                v-if="!approvalStatus.guardRejected"
                v-model="approvals.guard"
              >
                已阅
              </wd-checkbox>
              <!-- 新增：红色×复选框 -->
              <view
                v-else
                class="approval-checkbox-rejected"
              >
                <view class="checkbox-rejected">
                  <text class="reject-icon">×</text>
                </view>
                <text class="approval-text-rejected">未通过</text>
              </view>
            </label>
          </view>

          <view class="guard-info">
            <view class="info-item">
              <text class="info-label">临时访客证号</text>
              <view class="info-value">
                <!-- <text>V2508080001</text> -->
                <input v-model="form1.visitorNumber" type="text">
              </view>
            </view>
            <view class="info-item">
              <text class="info-label">临时车牌号</text>
              <view class="info-value">
                <!-- <text>T2508080001</text> -->
                <input v-model="form1.carNumber" type="text">
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <FooterBtn
      v-if="applyId && isShow"
      @reject="onReject"
      @transfer="onTransfer"
      @approve="onApprove"
    />
    <submit-btn v-if="!applyId" @submit="submit" />
    <!-- 问号弹窗 -->
    <Dialog v-if="showDialog" @close-popup="closeDialog">
      <template #title>
        <text class="dialog-title">访客类型说明</text>
      </template>
      <template #content>
        <text class="dialog-text">访客类型说明：学习交流场景定义...</text>
      </template>
    </Dialog>

    <!-- 驳回弹窗 -->
    <Dialog v-if="showReject" @close-popup="closePopup">
      <template #title>
        <text class="dialog-title">确定要驳回吗?</text>
      </template>
      <template #content>
        <wd-textarea v-model="rejectReason" placeholder="请填写理由" />
        <ButtonGroup
          :show-reject="showReject"
          type="error"
          @close-popup="closePopup"
          @confirm="confirmReject"
        />
      </template>
    </Dialog>

    <!-- 转办弹窗 -->
    <Dialog v-if="showTransfer" @close-popup="closeTransferPopup">
      <template #title>
        <text class="dialog-title">请选择转办人</text>
      </template>
      <template #content>
        <wd-picker
          v-model="value"
          :columns="columns"
          @confirm="handleConfirm1"
        />
        <ButtonGroup
          :show-reject="showTransfer"
          type="primary"
          @close-popup="closeTransferPopup"
          @confirm="confirmTranfer"
        />
      </template>
    </Dialog>

    <!-- 通过弹窗 -->
    <Dialog v-if="showApproval" @close-popup="closeApprovalPopup">
      <template #title>
        <text class="dialog-title">确定要通过吗?</text>
      </template>
      <template #content>
        <text class="text-sm text-#a3a8b9">抄送人(选填)</text>
        <wd-picker
          v-model="value"
          :columns="columns"
          @confirm="handleConfirm1"
        />
        <ButtonGroup
          :show-reject="showApproval"
          type="success"
          @close-popup="closeApprovalPopup"
          @confirm="confirmApproval"
        />
      </template>
    </Dialog>
  </view>
</template>

<style scoped lang="scss">
page {
  min-height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #ffffff;
}

.content {
  flex: 1;
  //   overflow: auto;
}

.form {
  &-section {
    padding: 24rpx;
    padding-top: 0;
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

.approval {
  &-item {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    display: flex; // 使用flex布局
    justify-content: space-between; // 左右对称
    align-items: center; // 垂直居中
  }
  &-item-extra {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  &-title {
    font-size: 14px;
    font-weight: 500;
    color: #1d2129;
  }

  &-checkbox {
    display: flex;
    align-items: center;
  }

  // 新增：红色×复选框样式
  &-checkbox-rejected {
    display: flex;
    align-items: center;
  }

  &-text {
    font-size: 14px;
    font-weight: 500;
    color: #165dff;
    margin-left: 8rpx;
  }

  // 新增：拒绝状态文字样式
  &-text-rejected {
    font-size: 14px;
    font-weight: 500;
    color: #ff4d4f;
    margin-left: 8rpx;
  }
}

// 新增：红色×复选框样式
.checkbox-rejected {
  width: 32rpx;
  height: 32rpx;
  border: 2px solid #ff4d4f;
  border-radius: 6rpx;
  background-color: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.2);
}

.reject-icon {
  color: #ffffff;
  font-size: 20rpx;
  font-weight: bold;
  line-height: 1;
}

.guard-info {
  margin-top: 16rpx;
}

.info {
  &-item {
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &-label {
    font-size: 14px;
    color: #4e5969;
    margin-bottom: 8rpx;
    display: block;
  }

  &-value {
    height: 64rpx;
    background-color: #f5f7fa;
    border-radius: 4rpx;
    padding: 0 24rpx;
    font-size: 14px;
    color: #1d2129;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &-content {
    background-color: #ffffff;
    border-radius: 16rpx;
    width: 80%;
    max-width: 600rpx;
    padding: 32rpx;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
  }

  &-title {
    font-size: 16px;
    font-weight: 500;
    color: #1d2129;
  }

  &-text {
    font-size: 14px;
    color: #4e5969;
  }
}

.required {
  &::after {
    content: '*';
    color: #ff4d4f;
    margin-left: 4rpx;
  }
}

.text-primary {
  color: #165dff;
}
</style>
