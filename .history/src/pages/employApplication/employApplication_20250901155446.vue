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

// 生成申请单号
function generateApplicationNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 900 + 100)
  return `${year}${month}${day}${random}`
}

// 表单数据
const form = ref({
  companyName: '',
  applicantName: '',
  idNumber: '',
  phone: '',
  totalNumber: '',
  hasVehicle: false,
  licensePlates: [{ number: '' }],
  hasTools: false,
  tools: [{
    name: '',
    quantity: 1,
    needExit: false,
  }],
  employees: [{
    name: '张伟',
    idNumber: '110105198003072356',
    phone: '13800138000',
    insuranceImage: null,
  }, {
    name: '李娜',
    idNumber: '110105198512153214',
    phone: '13900139000',
    insuranceImage: null,
  }],
  managerApproval: false,
  hrApproval: false,
})

const applicationNumber = ref('')
const uploadedFileName = ref('')
const uploadedFileUrl = ref('')

const employeeTypes = ref([
  { label: '分包商员工', value: 'subcontractor' },
  { label: '外协员工', value: 'outsourcing' },
  { label: '船东委外员工', value: 'shipowner' },
])

const employeeType = ref({ label: '', value: '' })

const departments = ref([
  { label: '生产部', value: 'production' },
  { label: '质量部', value: 'quality' },
  { label: '物流部', value: 'logistics' },
  { label: '安全部', value: 'safety' },
  { label: '人力资源部', value: 'hr' },
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
}

// 部门选择
function onDepartmentChange(e: any) {
  department.value = departments.value[e.detail.value]
}

// 车辆信息开关
function onVehicleChange(e: any) {
  form.value.hasVehicle = e.detail.value
  if (!form.value.hasVehicle) {
    form.value.licensePlates = [{ number: '' }]
  }
}

// 添加车牌号
function addLicensePlate() {
  form.value.licensePlates.push({ number: '' })
}

// 移除车牌号
function removeLicensePlate(index: number) {
  if (form.value.licensePlates.length > 1) {
    form.value.licensePlates.splice(index, 1)
  }
  else {
    uni.showToast({
      title: '至少保留一项车牌信息',
      icon: 'none',
    })
  }
}

// 工具物资开关
function onToolsChange(e: any) {
  form.value.hasTools = e.detail.value
  if (!form.value.hasTools) {
    form.value.tools = [{
      name: '',
      quantity: 1,
      needExit: false,
    }]
  }
}

// 添加工具
function addTool() {
  form.value.tools.push({
    name: '',
    quantity: 1,
    needExit: false,
  })
}

// 移除工具
function removeTool(index: number) {
  if (form.value.tools.length > 1) {
    form.value.tools.splice(index, 1)
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
  form.value.tools[index].needExit = e.detail.value
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

// 下载文件
function downloadFile() {
  if (uploadedFileUrl.value) {
    uni.downloadFile({
      url: uploadedFileUrl.value,
      success: (res) => {
        if (res.statusCode === 200) {
          uni.saveFile({
            tempFilePath: res.tempFilePath,
            success: (saveRes) => {
              uni.showToast({
                title: '文件保存成功',
                icon: 'success',
              })
            },
          })
        }
      },
    })
  }
}

// 添加员工
function addEmployee() {
  form.value.employees.push({
    name: '',
    idNumber: '',
    phone: '',
    insuranceImage: null,
  })
}

// 移除员工
function removeEmployee(index: number) {
  if (form.value.employees.length > 1) {
    uni.showModal({
      title: '提示',
      content: '确定要删除该员工信息吗？',
      success: (res) => {
        if (res.confirm) {
          form.value.employees.splice(index, 1)
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

// 驳回
function reject() {
  uni.showModal({
    title: '提示',
    content: '确定要驳回该申请吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '已驳回',
          icon: 'success',
        })
      }
    },
  })
}

// 转办
function transfer() {
  uni.showModal({
    title: '提示',
    content: '确定要转办该申请吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '已转办',
          icon: 'success',
        })
      }
    },
  })
}
</script>

<template>
  <scroll-view class="content" scroll-y>
    <form @submit="submitForm">
      <!-- 申请单号 -->
      <view class="form-section">
        <view class="form-row">
          <text class="form-label">申请单号：</text>
          <text class="form-value">{{ applicationNumber }}</text>
        </view>
      </view>

      <!-- 基础信息 -->
      <view class="form-section">
        <text class="section-title">基础信息</text>

        <!-- 人员类型 -->
        <view class="form-row">
          <text class="form-label">人员类型 <text class="required">*</text></text>
          <picker mode="selector" :range="employeeTypes" range-key="label" @change="onEmployeeTypeChange">
            <view class="picker">
              {{ employeeType.label || '请选择人员类型' }}
              <uni-icons type="arrowdown" size="16" color="#999" />
            </view>
          </picker>
        </view>

        <!-- 两列布局的信息 -->
        <view class="form-grid">
          <!-- 单位名称 -->
          <view class="form-row">
            <text class="form-label">单位名称 <text class="required">*</text></text>
            <input v-model="form.companyName" type="text" placeholder="请输入单位名称" class="form-input">
          </view>

          <!-- 申请人姓名 -->
          <view class="form-row">
            <text class="form-label">申请人姓名 <text class="required">*</text></text>
            <input v-model="form.applicantName" type="text" placeholder="请输入申请人姓名" class="form-input">
          </view>

          <!-- 身份证号 -->
          <view class="form-row">
            <text class="form-label">身份证号 <text class="required">*</text></text>
            <input v-model="form.idNumber" type="text" placeholder="请输入身份证号" class="form-input">
          </view>

          <!-- 联系电话 -->
          <view class="form-row">
            <text class="form-label">联系电话 <text class="required">*</text></text>
            <input v-model="form.phone" type="tel" placeholder="请输入联系电话" class="form-input">
          </view>
        </view>

        <!-- 所属部门 -->
        <view class="form-row">
          <text class="form-label">所属部门 <text class="required">*</text></text>
          <picker mode="selector" :range="departments" range-key="label" @change="onDepartmentChange">
            <view class="picker">
              {{ department.label || '请选择所属部门' }}
              <uni-icons type="arrowdown" size="16" color="#999" />
            </view>
          </picker>
        </view>

        <!-- 总人数 -->
        <view class="form-row">
          <text class="form-label">总人数 <text class="required">*</text></text>
          <input v-model="form.totalNumber" type="number" placeholder="请输入总人数" min="1" class="form-input">
        </view>
      </view>

      <!-- 车辆信息 -->
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">车辆信息 <text class="required">*</text></text>
        </view>

        <view class="form-row switch-row">
          <text class="form-label">是否有随行车辆</text>
          <switch :checked="form.hasVehicle" color="#3B82F6" @change="onVehicleChange" />
        </view>

        <view v-if="form.hasVehicle" class="vehicle-info">
          <view v-for="(plate, index) in form.licensePlates" :key="index" class="license-plate-item">
            <input v-model="plate.number" type="text" placeholder="请输入车牌号" class="form-input">
            <uni-icons type="close" size="20" color="#f56c6c" @click="removeLicensePlate(index)" />
          </view>
          <view class="add-btn" @click="addLicensePlate">
            <uni-icons type="plus" size="16" color="#3B82F6" />
            <text>添加车牌号</text>
          </view>
        </view>
      </view>

      <!-- 工具物资 -->
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">工具/物资信息 <text class="required">*</text></text>
        </view>

        <view class="form-row switch-row">
          <text class="form-label">是否携带工具/物资</text>
          <switch :checked="form.hasTools" color="#3B82F6" @change="onToolsChange" />
        </view>

        <view v-if="form.hasTools" class="tools-info">
          <view v-for="(tool, index) in form.tools" :key="index" class="tool-item">
            <uni-icons type="close" size="20" color="#f56c6c" class="delete-tool" @click="removeTool(index)" />

            <view class="form-row">
              <text class="form-label">工具/物资名称 <text class="required">*</text></text>
              <input v-model="tool.name" type="text" placeholder="请输入工具/物资名称" class="form-input">
            </view>

            <view class="form-row">
              <text class="form-label">数量 <text class="required">*</text></text>
              <input v-model="tool.quantity" type="number" placeholder="请输入数量" min="1" class="form-input">
            </view>

            <view class="form-row switch-row">
              <text class="form-label">是否离厂</text>
              <switch :checked="tool.needExit" color="#3B82F6" @change="(e) => onToolExitChange(index, e)" />
            </view>
          </view>

          <view class="add-btn" @click="addTool">
            <uni-icons type="plus" size="16" color="#3B82F6" />
            <text>添加工具/物资</text>
          </view>
        </view>
      </view>

      <!-- 员工清单 -->
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">员工清单 <text class="required">*</text></text>
          <view class="import-btn" @click="importExcel">
            <uni-icons type="upload" size="16" color="#3B82F6" />
            <text>导入Excel</text>
          </view>
        </view>

        <view v-if="uploadedFileName" class="uploaded-file">
          <view class="file-info">
            <uni-icons type="paperclip" size="20" color="#67C23A" />
            <text class="file-name">{{ uploadedFileName }}</text>
          </view>
          <view class="download-btn" @click="downloadFile">
            <uni-icons type="download" size="16" color="#3B82F6" />
            <text>下载</text>
          </view>
        </view>

        <view class="employee-list">
          <view v-for="(employee, index) in form.employees" :key="index" class="employee-card">
            <uni-icons type="close" size="20" color="#999" class="delete-employee" @click="removeEmployee(index)" />

            <view class="form-row">
              <text class="form-label">姓名</text>
              <input v-model="employee.name" type="text" placeholder="请输入员工姓名" class="form-input">
            </view>

            <view class="form-row">
              <text class="form-label">身份证号</text>
              <input v-model="employee.idNumber" type="text" placeholder="请输入身份证号" class="form-input">
            </view>

            <view class="form-row">
              <text class="form-label">联系电话</text>
              <input v-model="employee.phone" type="tel" placeholder="请输入联系电话" class="form-input">
            </view>

            <view class="form-row">
              <text class="form-label">商业保险</text>
              <view class="upload-area" @click="uploadInsurance(index)">
                <uni-icons type="cloud-upload" size="24" color="#999" />
                <text class="upload-text">点击上传商业保险图片</text>
                <input type="file" class="file-input" accept="image/*" @change="(e) => onFileChange(e, index)">
              </view>
            </view>
          </view>
        </view>

        <button type="button" class="add-employee-btn" @click="addEmployee">
          <uni-icons type="plus" size="16" color="#fff" />
          <text>添加员工</text>
        </button>
      </view>

      <!-- 审核信息 -->
      <view class="form-section">
        <text class="section-title">审核信息</text>

        <!-- 部门经理审核 -->
        <view class="approval-card">
          <text class="approval-title">部门经理审核</text>
          <label class="approval-checkbox">
            <checkbox :checked="form.managerApproval" color="#3B82F6" @change="onManagerApprovalChange" />
            <text>我已确认信息无误</text>
          </label>
        </view>

        <!-- 人资部审核 -->
        <view class="approval-card">
          <text class="approval-title">人资部审核</text>
          <label class="approval-checkbox">
            <checkbox :checked="form.hrApproval" color="#3B82F6" @change="onHrApprovalChange" />
            <text>我已确认商保信息无误</text>
          </label>
        </view>
      </view>
    </form>
  </scroll-view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

/* 导航栏 */
.nav-bar {
  height: 88rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 32rpx;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.nav-placeholder {
  width: 48rpx;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 88rpx 32rpx 120rpx;
  overflow: auto;
}

/* 表单部分 */
.form-section {
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.required {
  color: #f56c6c;
  margin-left: 8rpx;
}

.form-row {
  margin-bottom: 32rpx;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 14px;
  color: #333;
}

.picker {
  width: 100%;
  height: 80rpx;
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 两列布局 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

/* 开关行 */
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 车辆信息 */
.vehicle-info {
  margin-top: 24rpx;
}

.license-plate-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.license-plate-item .form-input {
  flex: 1;
  margin-right: 16rpx;
}

/* 工具信息 */
.tools-info {
  margin-top: 24rpx;
}

.tool-item {
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  position: relative;
}

.delete-tool {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
}

/* 员工清单 */
.import-btn {
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-size: 14px;
}

.import-btn text {
  margin-left: 8rpx;
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.file-info {
  display: flex;
  align-items: center;
}

.file-name {
  font-size: 14px;
  color: #666;
  margin-left: 16rpx;
  max-width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.download-btn {
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-size: 14px;
}

.download-btn text {
  margin-left: 8rpx;
}

.employee-list {
  margin-bottom: 24rpx;
}

.employee-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  position: relative;
}

.delete-employee {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
}

.upload-area {
  height: 160rpx;
  border: 1px dashed #e5e7eb;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  position: relative;
}

.upload-text {
  font-size: 14px;
  color: #999;
  margin-top: 16rpx;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.add-employee-btn {
  width: 100%;
  height: 88rpx;
  background-color: #3b82f6;
  color: #fff;
  border-radius: 8rpx;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-employee-btn text {
  margin-left: 8rpx;
}

/* 审核信息 */
.approval-card {
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.approval-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 24rpx;
}

.approval-checkbox {
  display: flex;
  align-items: center;
}

.approval-checkbox text {
  font-size: 14px;
  color: #666;
  margin-left: 16rpx;
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
  padding: 0 32rpx;
}

.footer button {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16rpx;
}

.reject-btn {
  background-color: #f56c6c;
  color: #fff;
}

.transfer-btn {
  background-color: #3b82f6;
  color: #fff;
}

.approve-btn {
  background-color: #67c23a;
  color: #fff;
}

/* 添加按钮 */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 14px;
  margin-top: 16rpx;
}

.add-btn text {
  margin-left: 8rpx;
}
</style>
