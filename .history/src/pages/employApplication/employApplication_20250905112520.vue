<route lang="jsonc">
{
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "员工核验申请",
  },
}
</route>

<script lang="ts" setup>
import { onBackPress } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { submitApplication } from '@/api/application'

// 生成申请单号
function generateApplicationNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 900 + 100)
  return `${year}${month}${day}${random}`
}

const initData = {
  applicationCode: '',
  applicationType: '2',
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
    isCar: false,
    carCode: '',
    isHaveGoods: false,
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

const applicationNumber = ref('')
const uploadedFileName = ref('')
const uploadedFileUrl = ref('')

const employeeTypes = ref([
  { label: '分包商员工', value: '分包商员工' },
  { label: '外协员工', value: '外协员工' },
  { label: '船东委外员工', value: '船东委外员工' },
])

const employeeType = ref({ label: '', value: '' })

const departments = ref([
  { label: '生产部', value: '生产部' },
  { label: '质量部', value: '质量部' },
  { label: '物流部', value: '物流部' },
  { label: '安全部', value: '安全部' },
  { label: '人力资源部', value: '人力资源部' },
])

const department = ref({ label: '', value: '' })

// 初始化
onMounted(() => {
  applicationNumber.value = generateApplicationNumber()
})

// 返回
function goBack() {
  uni.navigateBack()
}

// 监听返回按钮
onBackPress(() => {
  goBack()
  return true
})

// 人员类型选择
function onEmployeeTypeChange(e: any) {
  employeeType.value = employeeTypes.value[e.detail.value]
  form.value.ylfkCheckApplicationPage.userType = employeeType.value.value
}

// 部门选择
function onDepartmentChange(e: any) {
  department.value = departments.value[e.detail.value]
  form.value.ylfkCheckApplicationPage.belongDept = department.value.value
}

// 车辆信息开关
function onVehicleChange(e: any) {
  form.value.ylfkCheckApplicationPage.isCar = e.detail.value
}

// 工具物资开关
function onToolsChange(e: any) {
  form.value.ylfkCheckApplicationPage.isHaveGoods = e.detail.value
}

// 添加工具
function addTool() {
  form.value.ylfkCheckApplicationPage.checkHaveGoodsList.push({
    toolName: '',
    num: '',
    isLeave: '',
  })
}

// 移除工具
function removeTool(index: number) {
  if (form.value.ylfkCheckApplicationPage.checkHaveGoodsList.length > 1) {
    form.value.ylfkCheckApplicationPage.checkHaveGoodsList.splice(index, 1)
  }
  else {
    uni.showToast({
      title: '至少保留一项工具信息',
      icon: 'none',
    })
  }
}

// 工具离厂状态变更
function onToolExitChange(index: number, e: any) {
  form.value.ylfkCheckApplicationPage.checkHaveGoodsList[index].isLeave
    = e.detail.value
}

// 导入Excel
function importExcel() {
  uni.chooseFile({
    count: 1,
    type: 'file',
    extension: ['.xlsx', '.xls'],
    success: (res) => {
      const file = res.tempFiles[0]
      uploadedFileName.value = file.name
      uploadedFileUrl.value = file.path
    },
  })
}

function downloadFile() {
  console.log('ok')
}

// 下载文件

// 添加员工
function addEmployee() {
  form.value.ylfkCheckApplicationPage.checkUsersList.push({
    name: '',
    cardCode: '',
    phone: '',
    insurance: '',
  })
}

// 移除员工
function removeEmployee(index: number) {
  if (form.value.ylfkCheckApplicationPage.checkUsersList.length > 1) {
    uni.showModal({
      title: '提示',
      content: '确定要删除该员工信息吗？',
      success: (res) => {
        if (res.confirm) {
          form.value.ylfkCheckApplicationPage.checkUsersList.splice(index, 1)
        }
      },
    })
  }
  else {
    uni.showToast({
      title: '至少保留一项员工信息',
      icon: 'none',
    })
  }
}

// 上传保险
function uploadInsurance(index: number) {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value.employees[index].insuranceImage = res.tempFilePaths[0]
    },
  })
}

// 文件变更
function onFileChange(e: any, index: number) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      form.value.employees[index].insuranceImage = event.target?.result
    }
    reader.readAsDataURL(file)
  }
}

// 部门经理审核
function onManagerApprovalChange(e: any) {
  form.value.managerApproval = e.detail.value
}

// 人资部审核
function onHrApprovalChange(e: any) {
  form.value.hrApproval = e.detail.value
}

// 表单提交
function submitForm() {
  if (!form.value.hasVehicle && !form.value.hasTools) {
    uni.showToast({
      title: '请至少选择是否有随行车辆或是否携带工具/物资',
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: '表单提交成功',
    icon: 'success',
  })
}

const applyId = ref('')
const showReject = ref<boolean>(false)
const showTransfer = ref<boolean>(false)
const showApproval = ref<boolean>(false)
const rejectReason = ref<string>('')
const value = ref<number[]>([])
function closePopup(data) {
  console.log(data)
  showReject.value = data
}

function closeTransferPopup(data) {
  showTransfer.value = data
}
function closeApprovalPopup() {
  showApproval.value = false
}
const columns = ref([
  '选项1',
  '选项2',
  '选项3',
  '选项4',
  '选项5',
  '选项6',
  '选项7',
])
const isShow = ref(false)
const value1 = ref('选项1')
function handleConfirm1({ value }) {
  value1.value = value
}
const licenseInfo = ref([''])
async function submit() {
  form.value.ylfkCheckApplicationPage.carCode = licenseInfo.value.join(',')
  console.log(form.value)
  // const res = await submitApplication(form.value)
  // if (res.code === 200) {
  //   uni.showToast({
  //     title: '提交成功',
  //     icon: 'success',
  //     duration: 2000,
  //   })
  //   setTimeout(() => {
  //     uni.switchTab({ url: '/pages/index/index' })
  //   }, 2000)
  // }
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

// 添加车牌号
function addLicensePlate() {
  licenseInfo.value.push('')
}

// 移除车牌号
function removeLicensePlate(index: number) {
  if (licenseInfo.value.length > 1) {
    licenseInfo.value.splice(index, 1)
  }
  else {
    uni.showToast({
      title: '至少保留一项车牌信息',
      icon: 'none',
    })
  }
}
</script>

<template>
  <view class="container">
    <scroll-view class="content" scroll-y>
      <form @submit="submitForm">
        <!-- 申请单号 -->
        <view v-if="applyId" class="form-section">
          <view class="application-number-row">
            <text class="form-label">申请单号：</text>
            <text class="form-value">{{ applyId }}</text>
          </view>
        </view>

        <!-- 基础信息 -->
        <view class="form-section">
          <text class="section-title">基础信息</text>

          <!-- 人员类型 -->
          <view class="form-row">
            <text class="form-label">
              人员类型 <text class="required">*</text>
            </text>
            <picker
              mode="selector"
              :range="employeeTypes"
              range-key="label"
              @change="onEmployeeTypeChange"
            >
              <view class="picker">
                {{ employeeType.label || "请选择人员类型" }}
                <view class="i-carbon-chevron-down text-16px text-gray-400" />
              </view>
            </picker>
          </view>

          <!-- 两列布局的信息 -->
          <view class="form-grid">
            <!-- 单位名称 -->
            <view class="form-row">
              <text class="form-label">
                单位名称 <text class="required">*</text>
              </text>
              <input
                v-model="form.ylfkCheckApplicationPage.deptName"
                type="text"
                placeholder="请输入单位名称"
                class="form-input"
              >
            </view>

            <!-- 申请人姓名 -->
            <view class="form-row">
              <text class="form-label">
                申请人姓名 <text class="required">*</text>
              </text>
              <input
                v-model="form.ylfkCheckApplicationPage.user"
                type="text"
                placeholder="请输入申请人姓名"
                class="form-input"
              >
            </view>
          </view>

          <view class="form-grid">
            <!-- 身份证号 -->
            <view class="form-row">
              <text class="form-label">
                身份证号 <text class="required">*</text>
              </text>
              <input
                v-model="form.ylfkCheckApplicationPage.idCard"
                type="text"
                placeholder="请输入身份证号"
                class="form-input"
              >
            </view>

            <!-- 联系电话 -->
            <view class="form-row">
              <text class="form-label">
                联系电话 <text class="required">*</text>
              </text>
              <input
                v-model="form.ylfkCheckApplicationPage.phone"
                type="tel"
                placeholder="请输入联系电话"
                class="form-input"
              >
            </view>
          </view>

          <!-- 所属部门 -->
          <view class="form-row">
            <text class="form-label">
              所属部门 <text class="required">*</text>
            </text>
            <picker
              mode="selector"
              :range="departments"
              range-key="label"
              @change="onDepartmentChange"
            >
              <view class="picker">
                {{ department.label || "请选择所属部门" }}
                <view class="i-carbon-chevron-down text-16px text-gray-400" />
              </view>
            </picker>
          </view>

          <!-- 总人数 -->
          <view class="form-row">
            <text class="form-label">
              总人数 <text class="required">*</text>
            </text>
            <input
              v-model="form.ylfkCheckApplicationPage.allUsers"
              type="number"
              placeholder="请输入总人数"
              min="1"
              class="form-input"
            >
          </view>
        </view>

        <!-- 车辆信息 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title">
              车辆信息 <text class="required">*</text>
            </text>
          </view>

          <view class="form-row switch-row">
            <text class="form-label">是否有随行车辆</text>
            <switch
              :checked="form.ylfkCheckApplicationPage.isCar"
              color="#3B82F6"
              @change="onVehicleChange"
            />
          </view>

          <view v-if="form.ylfkCheckApplicationPage.isCar" class="vehicle-info">
            <view
              v-for="(plate, index) in licenseInfo"
              :key="index"
              class="license-plate-item"
            >
              <input
                v-model="licenseInfo[index]"
                type="text"
                placeholder="请输入车牌号"
                class="form-input flex-1"
              >
              <view
                class="i-carbon-close ml-16rpx cursor-pointer text-20px text-red-500"
                @click="removeLicensePlate(index)"
              />
            </view>
            <view class="add-btn" @click="addLicensePlate">
              <view class="i-carbon-add text-16px text-blue-500" />
              <text>添加车牌号</text>
            </view>
          </view>
        </view>

        <!-- 工具物资 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title">
              工具/物资信息 <text class="required">*</text>
            </text>
          </view>

          <view class="form-row switch-row">
            <text class="form-label">是否携带工具/物资</text>
            <switch
              :checked="form.ylfkCheckApplicationPage.isHaveGoods"
              color="#3B82F6"
              @change="onToolsChange"
            />
          </view>

          <view
            v-if="form.ylfkCheckApplicationPage.isHaveGoods"
            class="tools-info"
          >
            <view
              v-for="(tool, index) in form.ylfkCheckApplicationPage
                .checkHaveGoodsList"
              :key="index"
              class="tool-item"
            >
              <view
                class="i-carbon-close delete-tool text-20px text-red-500"
                @click="removeTool(index)"
              />

              <view class="form-row">
                <text class="form-label">
                  工具/物资名称 <text class="required">*</text>
                </text>
                <input
                  v-model="tool.toolName"
                  type="text"
                  placeholder="请输入工具/物资名称"
                  class="form-input"
                >
              </view>

              <view class="form-row">
                <text class="form-label">
                  数量 <text class="required">*</text>
                </text>
                <input
                  v-model="tool.num"
                  type="number"
                  placeholder="请输入数量"
                  min="1"
                  class="form-input"
                >
              </view>

              <view class="form-row switch-row">
                <text class="form-label">是否离厂</text>
                <switch
                  :checked="tool.isLeave"
                  color="#3B82F6"
                  @change="(e) => onToolExitChange(index, e)"
                />
              </view>
            </view>

            <view class="add-btn" @click="addTool">
              <view class="i-carbon-add text-16px text-blue-500" />
              <text>添加工具/物资</text>
            </view>
          </view>
        </view>

        <!-- 员工清单 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title">
              员工清单 <text class="required">*</text>
            </text>
            <view class="import-btn" @click="importExcel">
              <view class="i-carbon-upload text-16px text-blue-500" />
              <text>导入Excel</text>
            </view>
          </view>

          <view v-if="uploadedFileName" class="uploaded-file">
            <view class="file-info">
              <view class="i-carbon-document text-20px text-green-500" />
              <text class="file-name">{{ uploadedFileName }}</text>
            </view>
            <view class="download-btn" @click="downloadFile">
              <view class="i-carbon-download text-16px text-blue-500" />
              <text>下载</text>
            </view>
          </view>

          <view class="employee-list">
            <view
              v-for="(employee, index) in form.ylfkCheckApplicationPage
                .checkUsersList"
              :key="index"
              class="employee-card"
            >
              <view
                class="i-carbon-close delete-employee text-20px text-gray-400"
                @click="removeEmployee(index)"
              />

              <view class="form-row">
                <text class="form-label">姓名</text>
                <input
                  v-model="employee.name"
                  type="text"
                  placeholder="请输入员工姓名"
                  class="form-input"
                >
              </view>

              <view class="form-row">
                <text class="form-label">身份证号</text>
                <input
                  v-model="employee.cardCode"
                  type="text"
                  placeholder="请输入身份证号"
                  class="form-input"
                >
              </view>

              <view class="form-row">
                <text class="form-label">联系电话</text>
                <input
                  v-model="employee.phone"
                  type="tel"
                  placeholder="请输入联系电话"
                  class="form-input"
                >
              </view>

              <view class="form-row">
                <text class="form-label">商业保险</text>
                <view class="upload-area" @click="uploadInsurance(index)">
                  <view class="i-carbon-cloud-upload text-24px text-gray-400" />
                  <text class="upload-text">点击上传商业保险图片</text>
                  <input
                    type="file"
                    class="file-input"
                    accept="image/*"
                    @change="(e) => onFileChange(e, index)"
                  >
                </view>
              </view>
            </view>
          </view>

          <button type="button" class="add-employee-btn" @click="addEmployee">
            <view class="i-carbon-add text-16px text-white" />
            <text>添加员工</text>
          </button>
        </view>

        <!-- 审核信息 -->
        <view v-if="isShow" class="form-section">
          <text class="section-title">审核信息</text>

          <!-- 部门经理审核 -->
          <view class="approval-card">
            <text class="approval-title">部门经理审核</text>
            <label class="approval-checkbox">
              <checkbox
                :checked="form.managerApproval"
                color="#3B82F6"
                @change="onManagerApprovalChange"
              />
              <text>我已确认信息无误</text>
            </label>
          </view>

          <!-- 人资部审核 -->
          <view class="approval-card">
            <text class="approval-title">人资部审核</text>
            <label class="approval-checkbox">
              <checkbox
                :checked="form.hrApproval"
                color="#3B82F6"
                @change="onHrApprovalChange"
              />
              <text>我已确认商保信息无误</text>
            </label>
          </view>
        </view>
      </form>
    </scroll-view>

    <!-- 底部按钮 -->
    <FooterBtn
      v-if="applyId && isShow"
      @reject="onReject"
      @transfer="onTransfer"
      @approve="onApprove"
    />
    <submit-btn v-if="!applyId" @submit="submit" />

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
        />
      </template>
    </Dialog>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #f5f5f5;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 20rpx 32rpx 120rpx;
  max-width: 750rpx;
  margin: 0 auto;
}

/* 表单部分 */
.form-section {
  margin-bottom: 24rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  width: 690rpx;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
}

.required {
  color: #ef4444;
  margin-left: 4rpx;
}

.form-row {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

/* 申请单号行 */
.application-number-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #374151;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.form-value {
  font-size: 28rpx;
  color: #1f2937;
  font-weight: 600;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #d1d5db;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #1f2937;
  background-color: #fff;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
}

.picker {
  width: 100%;
  height: 80rpx;
  border: 1px solid #d1d5db;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #1f2937;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

/* 两列布局 */
.form-grid {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;

  .form-row {
    flex: 1;
    margin-bottom: 0;
  }
}

/* 开关行 */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .form-label {
    margin-bottom: 0;
  }
}

/* 车辆信息 */
.vehicle-info {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid #e5e7eb;
}

.license-plate-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  gap: 16rpx;
}

/* 工具信息 */
.tools-info {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1px solid #e5e7eb;
}

.tool-item {
  background-color: #f9fafb;
  border-radius: 8rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  position: relative;
  border: 1px solid #e5e7eb;
}

.delete-tool {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  cursor: pointer;
}

/* 员工清单 */
.import-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #3b82f6;
  font-size: 28rpx;
  cursor: pointer;
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.file-name {
  font-size: 28rpx;
  color: #374151;
  max-width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #3b82f6;
  font-size: 28rpx;
  cursor: pointer;
}

.employee-list {
  margin-bottom: 24rpx;
}

.employee-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  position: relative;
}

.delete-employee {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  cursor: pointer;
}

.upload-area {
  height: 160rpx;
  border: 2rpx dashed #d1d5db;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  position: relative;
  cursor: pointer;

  &:hover {
    border-color: #3b82f6;
    background-color: #f0f9ff;
  }
}

.upload-text {
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.add-employee-btn {
  width: 100%;
  height: 80rpx;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
}

/* 审核信息 */
.approval-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  margin-top: 10rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.approval-title {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 16rpx;
}

.approval-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;

  text {
    font-size: 28rpx;
    color: #374151;
    margin-left: 12rpx;
  }
}

/* 底部按钮 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  gap: 16rpx;
  z-index: 10;
}

.footer-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  &.reject-btn {
    background-color: #ef4444;
    color: #fff;

    &:hover {
      background-color: #dc2626;
    }
  }

  &.transfer-btn {
    background-color: #f59e0b;
    color: #fff;

    &:hover {
      background-color: #d97706;
    }
  }

  &.approve-btn {
    background-color: #10b981;
    color: #fff;

    &:hover {
      background-color: #059669;
    }
  }
}

/* 添加按钮 */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #3b82f6;
  font-size: 28rpx;
  margin-top: 16rpx;
  padding: 12rpx;
  border: 1px dashed #3b82f6;
  border-radius: 8rpx;
  cursor: pointer;

  &:hover {
    background-color: #f0f9ff;
  }
}

/* 工具类 */
.flex-1 {
  flex: 1;
}

.ml-16rpx {
  margin-left: 16rpx;
}

.cursor-pointer {
  cursor: pointer;
}

/* 响应式调整 */
@media (max-width: 750rpx) {
  .form-grid {
    flex-direction: column;
    gap: 0;

    .form-row {
      margin-bottom: 24rpx;
    }
  }

  .footer {
    padding: 16rpx;
    gap: 12rpx;
  }

  .footer-btn {
    font-size: 24rpx;
  }
}
</style>
