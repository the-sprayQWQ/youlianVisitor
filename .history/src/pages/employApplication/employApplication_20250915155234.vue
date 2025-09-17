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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { submitApplication } from '@/api/application'
import { getAllDepartment } from '../../api/sys'
import { uploadFileUrl, useUpload } from '../../utils/uploadFile'

const baseUrl = import.meta.env.VITE_SERVER_BASEURL
const employeeUploaders = ref({})

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

const employeeTypes = ref([
  { label: '分包商员工', value: '分包商员工' },
  { label: '外协员工', value: '外协员工' },
  { label: '船东委外员工', value: '船东委外员工' },
])

const employeeType = ref({ label: '', value: '' })

const departments = ref([])

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
  console.log('导入Excel')
}

// 下载文件
function downloadFile() {
  console.log('ok')
}

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
          const newUploaders = {}
          Object.keys(employeeUploaders.value).forEach((key) => {
            const keyNum = Number.parseInt(key)
            if (keyNum < index) {
              newUploaders[keyNum] = employeeUploaders.value[keyNum]
            }
            else if (keyNum > index) {
              newUploaders[keyNum - 1] = employeeUploaders.value[keyNum]
            }
          })
          employeeUploaders.value = newUploaders
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

function getEmployeeUploader(index) {
  if (!employeeUploaders.value[index]) {
    const { loading, error, data, progress, run } = useUpload(
      uploadFileUrl.USER_AVATAR,
      {},
      {
        maxSize: 5,
        onSuccess: (res) => {
          console.log(`员工${index}保险图片上传成功:`, res)
          form.value.ylfkCheckApplicationPage.checkUsersList[index].insurance
            = res.message
        },
        onError: (err) => {
          console.error(`员工${index}保险图片上传失败:`, err)
          uni.showToast({
            title: '保险图片上传失败',
            icon: 'none',
          })
        },
      },
    )

    employeeUploaders.value[index] = { loading, error, data, progress, run }
  }

  return employeeUploaders.value[index]
}

// 上传保险
function uploadInsurance(index: number) {
  const uploader = getEmployeeUploader(index)
  if (uploader.loading.value)
    return
  uploader.run()
}
// 预览保险图片
function previewInsurance(index) {
  const employee = form.value.ylfkCheckApplicationPage.checkUsersList[index]
  if (!employee.insurance)
    return

  const imageUrl = `${baseUrl}/${employee.insurance}`

  uni.previewImage({
    current: imageUrl,
    urls: [imageUrl],
    longPressActions: {
      itemList: ['保存图片'],
      success: (res) => {
        if (res.tapIndex === 0) {
          uni.saveImageToPhotosAlbum({
            filePath: imageUrl,
            success: () => {
              uni.showToast({
                title: '保存成功',
                icon: 'success',
              })
            },
            fail: (err) => {
              console.error('保存失败:', err)
              uni.showToast({
                title: '保存失败',
                icon: 'none',
              })
            },
          })
        }
      },
    },
  })
}

// 删除保险图片
function deleteInsurance(index) {
  form.value.ylfkCheckApplicationPage.checkUsersList[index].insurance = ''
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

async function getDepartList() {
  const res = await getAllDepartment()
  if (res.result) {
    departments.value = res.result.map(item => ({
      label: item.departName,
      value: item.id,
    }))
  }
}
onLoad(async (e) => {
  await getDepartList()
  if (e.applyId) {
    applyId.value = e.applyId
  }
})
</script>

<template>
  <view class="page-container">
    <scroll-view class="content-scroll" scroll-y>
      <form class="form-wrapper">
        <!-- 申请单号 -->
        <view v-if="applyId" class="application-number">
          <text class="number-label">申请单号：</text>
          <text class="number-value">{{ applyId }}</text>
        </view>

        <!-- 基础信息 -->
        <view class="section-card">
          <view class="section-title">
            基础信息
          </view>

          <!-- 人员类型 -->
          <view class="field-row">
            <text class="field-label required">人员类型</text>
            <picker
              mode="selector"
              :range="employeeTypes"
              range-key="label"
              class="picker-field"
              @change="onEmployeeTypeChange"
            >
              <view class="picker-display">
                <text class="picker-text">
                  {{ employeeType.label || "请选择人员类型" }}
                </text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>

          <!-- 两列布局 -->
          <view class="dual-column">
            <view class="column-field">
              <text class="field-label required">单位名称</text>
              <input
                v-model="form.ylfkCheckApplicationPage.deptName"
                type="text"
                placeholder="请输入单位名称"
                class="input-field"
              >
            </view>
            <view class="column-field">
              <text class="field-label required">申请人姓名</text>
              <input
                v-model="form.ylfkCheckApplicationPage.user"
                type="text"
                placeholder="请输入申请人姓名"
                class="input-field"
              >
            </view>
          </view>

          <view class="dual-column">
            <view class="column-field">
              <text class="field-label required">身份证号</text>
              <input
                v-model="form.ylfkCheckApplicationPage.idCard"
                type="text"
                placeholder="请输入身份证号"
                class="input-field"
              >
            </view>
            <view class="column-field">
              <text class="field-label required">联系电话</text>
              <input
                v-model="form.ylfkCheckApplicationPage.phone"
                type="tel"
                placeholder="请输入联系电话"
                class="input-field"
              >
            </view>
          </view>

          <!-- 所属部门 -->
          <view class="field-row">
            <text class="field-label required">所属部门</text>
            <picker
              mode="selector"
              :range="departments"
              range-key="label"
              class="picker-field"
              @change="onDepartmentChange"
            >
              <view class="picker-display">
                <text class="picker-text">
                  {{ department.label || "请选择所属部门" }}
                </text>
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>

          <!-- 总人数 -->
          <view class="field-row">
            <text class="field-label required">总人数</text>
            <input
              v-model="form.ylfkCheckApplicationPage.allUsers"
              type="number"
              placeholder="请输入总人数"
              min="1"
              class="input-field"
            >
          </view>
        </view>

        <!-- 车辆信息 -->
        <view class="section-card">
          <view class="section-title required">
            车辆信息
          </view>

          <view class="toggle-row">
            <text class="toggle-label">车辆号</text>
            <switch
              :checked="form.ylfkCheckApplicationPage.isCar"
              color="#007AFF"
              @change="onVehicleChange"
            />
          </view>

          <view v-if="form.ylfkCheckApplicationPage.isCar" class="vehicle-section">
            <view
              v-for="(plate, index) in licenseInfo"
              :key="index"
              class="vehicle-input-row"
            >
              <text class="vehicle-label">车牌号：</text>
              <input
                v-model="licenseInfo[index]"
                type="text"
                placeholder="请输入车牌号"
                class="vehicle-input"
              >
              <text
                v-if="licenseInfo.length > 1"
                class="remove-icon"
                @click="removeLicensePlate(index)"
              >
                ×
              </text>
            </view>

            <!-- 图片上传区域 -->
            <view class="upload-section">
              <view class="upload-label">
                车辆照片
              </view>
              <view class="upload-area">
                <text class="upload-icon">📷</text>
                <text class="upload-text">上传车辆照片</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 工具/物资信息 -->
        <view class="section-card">
          <view class="section-title required">
            工具/物资信息
          </view>

          <view class="toggle-row">
            <text class="toggle-label">工具/物资清单：</text>
            <switch
              :checked="form.ylfkCheckApplicationPage.isHaveGoods"
              color="#007AFF"
              @change="onToolsChange"
            />
          </view>

          <view v-if="form.ylfkCheckApplicationPage.isHaveGoods" class="tools-section">
            <view
              v-for="(tool, index) in form.ylfkCheckApplicationPage.checkHaveGoodsList"
              :key="index"
              class="tool-card"
            >
              <view class="tool-header">
                <text class="tool-title">工具/物资清单：</text>
                <text
                  v-if="form.ylfkCheckApplicationPage.checkHaveGoodsList.length > 1"
                  class="remove-icon"
                  @click="removeTool(index)"
                >
                  ×
                </text>
              </view>

              <view class="tool-field">
                <text class="tool-label">数量/物资清单：</text>
                <input
                  v-model="tool.toolName"
                  type="text"
                  placeholder="数量/物资清单"
                  class="tool-input"
                >
              </view>

              <!-- 物资照片上传 -->
              <view class="upload-section">
                <view class="upload-label">
                  物资照片
                </view>
                <view class="upload-area">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传物资照片</text>
                </view>

                <view class="checkbox-row">
                  <checkbox
                    :checked="tool.isLeave"
                    @change="(e) => onToolExitChange(index, e)"
                  />
                  <text class="checkbox-text">我已确认以上工具信息完整</text>
                </view>
              </view>
            </view>

            <view class="add-button" @click="addTool">
              <text class="add-text">+ 添加工具/物资</text>
            </view>
          </view>
        </view>

        <!-- 员工清单 -->
        <view class="section-card">
          <view class="section-header">
            <view class="section-title required">
              员工清单
            </view>
            <view class="import-excel" @click="importExcel">
              <text class="import-icon">📊</text>
              <text class="import-text">导入Excel</text>
            </view>
          </view>

          <view class="employee-list">
            <view
              v-for="(employee, index) in form.ylfkCheckApplicationPage.checkUsersList"
              :key="index"
              class="employee-card"
            >
              <view class="employee-header">
                <text class="employee-title">姓名</text>
                <text
                  v-if="form.ylfkCheckApplicationPage.checkUsersList.length > 1"
                  class="remove-icon"
                  @click="removeEmployee(index)"
                >
                  ×
                </text>
              </view>

              <input
                v-model="employee.name"
                type="text"
                placeholder="张某"
                class="employee-input"
              >

              <view class="employee-field">
                <text class="employee-label">身份证号</text>
                <input
                  v-model="employee.cardCode"
                  type="text"
                  placeholder="110105198003072356"
                  class="employee-input"
                >
              </view>

              <view class="employee-field">
                <text class="employee-label">联系电话</text>
                <input
                  v-model="employee.phone"
                  type="tel"
                  placeholder="13800138000"
                  class="employee-input"
                >
              </view>

              <view class="employee-field">
                <text class="employee-label">商业保险</text>

                <!-- 如果没有上传图片，显示上传区域 -->
                <view
                  v-if="!employee.insurance"
                  class="insurance-upload"
                  :class="{ uploading: getEmployeeUploader(index).loading.value }"
                  @click="uploadInsurance(index)"
                >
                  <text class="insurance-icon">📷</text>
                  <text class="insurance-text">
                    {{ getEmployeeUploader(index).loading.value ? "上传中..." : "点击上传商业保险图片" }}
                  </text>
                </view>

                <!-- 如果已上传，显示图片预览 -->
                <view v-else class="insurance-preview">
                  <image
                    :src="`${baseUrl}/${employee.insurance}`"
                    mode="aspectFit"
                    class="insurance-image"
                    @click="previewInsurance(index)"
                  />
                  <view class="insurance-actions">
                    <text class="action-btn delete" @click.stop="deleteInsurance(index)">删除</text>
                    <text class="action-btn reupload" @click.stop="uploadInsurance(index)">重传</text>
                  </view>
                </view>

                <!-- 上传失败提示 -->
                <view v-if="getEmployeeUploader(index).error.value" class="error-message">
                  <text>上传失败，请重试</text>
                </view>
              </view>
            </view>
          </view>

          <view class="add-employee-button" @click="addEmployee">
            <text class="add-employee-text">+ 添加员工</text>
          </view>
        </view>

        <!-- 审核信息 -->
        <view v-if="isShow" class="section-card">
          <view class="section-title">
            审核信息
          </view>

          <view class="approval-item">
            <text class="approval-title">归口管理部门经理审核</text>
            <view class="approval-checkbox">
              <checkbox
                :checked="form.managerApproval"
                color="#007AFF"
                @change="onManagerApprovalChange"
              />
              <text class="approval-text">我已确认信息完整</text>
            </view>
          </view>

          <view class="approval-item">
            <text class="approval-title">人资部审核</text>
            <view class="approval-checkbox">
              <checkbox
                :checked="form.hrApproval"
                color="#007AFF"
                @change="onHrApprovalChange"
              />
              <text class="approval-text">我已确认商保信息完整</text>
            </view>
          </view>

          <view class="approval-item">
            <text class="approval-title">行政部审核</text>
            <view class="approval-checkbox">
              <checkbox color="#007AFF" />
              <text class="approval-text">我已确认房卡车卡完整</text>
            </view>
          </view>

          <view class="approval-item">
            <text class="approval-title">门卫厂审核</text>
            <view class="approval-section">
              <view class="vehicle-info-section">
                <text class="info-label">车辆信息</text>
                <view class="info-row">
                  <text class="info-item">车牌号：</text>
                  <text class="info-value">-</text>
                </view>
                <view class="info-row">
                  <text class="info-item">临时通行证号：</text>
                  <text class="info-value">-</text>
                </view>
                <view class="approval-checkbox">
                  <checkbox color="#007AFF" />
                  <text class="approval-text">已按规临时通行证</text>
                </view>

                <text class="info-label">票厂车辆照片</text>
                <view class="upload-area small">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传票厂车辆照片</text>
                </view>
              </view>

              <view class="tools-info-section">
                <text class="info-label">工具/物资信息</text>
                <view class="info-row">
                  <text class="info-item">物资清单：</text>
                </view>
                <input
                  type="text"
                  placeholder="数量/物资清单"
                  class="info-input"
                >

                <text class="info-label">票厂物资照片</text>
                <view class="upload-area small">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传票厂物资照片</text>
                </view>

                <view class="approval-checkbox">
                  <checkbox color="#007AFF" />
                  <text class="approval-text">我已确认票厂信息完整</text>
                </view>
              </view>
            </view>
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

    <!-- 弹窗组件保持不变 -->
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
/* 页面整体样式 */
.page-container {
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  padding: 20rpx;
}

.form-wrapper {
  max-width: 750rpx;
  margin: 0 auto;
}

/* 申请单号 */
.application-number {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.number-label {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.number-value {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}

/* 卡片样式 */
.section-card {
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 36rpx;
  color: #333;
  font-weight: 600;

  &.required::after {
    content: '*';
    color: #ff4d4f;
    margin-left: 4rpx;
  }
}

/* 表单字段 */
.field-row {
  margin-bottom: 30rpx;
}

.field-label {
  display: block;
  font-size: 30rpx;
  color: #333;
  margin-bottom: 15rpx;

  &.required::after {
    content: '*';
    color: #ff4d4f;
    margin-left: 4rpx;
  }
}

.input-field {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  background: #fff;

  &:focus {
    border-color: #007aff;
  }
}

/* 选择器样式 */
.picker-field {
  width: 100%;
}

.picker-display {
  height: 80rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.picker-text {
  font-size: 30rpx;
  color: #333;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

/* 两列布局 */
.dual-column {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.column-field {
  flex: 1;
}

/* 开关切换 */
.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.toggle-label {
  font-size: 30rpx;
  color: #333;
}

/* 车辆信息 */
.vehicle-section {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 30rpx;
  margin-top: 20rpx;
}

.vehicle-input-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.vehicle-label {
  font-size: 30rpx;
  color: #333;
  width: 120rpx;
  flex-shrink: 0;
}

.vehicle-input {
  flex: 1;
  height: 60rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  padding: 0 15rpx;
  font-size: 28rpx;
  margin: 0 15rpx;
}

.remove-icon {
  font-size: 40rpx;
  color: #ff4d4f;
  width: 40rpx;
  text-align: center;
  cursor: pointer;
}

/* 上传区域 */
.upload-section {
  margin-top: 30rpx;
}

.upload-label {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.upload-area {
  height: 140rpx;
  border: 2rpx dashed #d9d9d9;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;

  &.small {
    height: 100rpx;
  }
}

.upload-icon {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 26rpx;
  color: #666;
}

/* 工具信息 */
.tools-section {
  border-top: 2rpx solid #f0f0f0;
  padding-top: 30rpx;
  margin-top: 20rpx;
}

.tool-card {
  border: 2rpx solid #f0f0f0;
  border-radius: 8rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
  background: #fafafa;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.tool-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.tool-field {
  margin-bottom: 20rpx;
}

.tool-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.tool-input {
  width: 100%;
  height: 60rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  padding: 0 15rpx;
  font-size: 28rpx;
  background: #fff;
}

.checkbox-row {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.checkbox-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 15rpx;
}

/* 添加按钮 */
.add-button {
  text-align: center;
  padding: 20rpx;
  color: #007aff;
  font-size: 30rpx;
  border: 2rpx dashed #007aff;
  border-radius: 8rpx;
  cursor: pointer;
}

/* 导入Excel */
.import-excel {
  display: flex;
  align-items: center;
  color: #007aff;
  font-size: 28rpx;
  cursor: pointer;
}

.import-icon {
  margin-right: 8rpx;
}

/* 员工列表 */
.employee-list {
  margin-bottom: 30rpx;
}

.employee-card {
  border: 2rpx solid #f0f0f0;
  border-radius: 8rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
  background: #fafafa;
}

.employee-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.employee-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.employee-field {
  margin-bottom: 20rpx;
}

.employee-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.employee-input {
  width: 100%;
  height: 60rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  padding: 0 15rpx;
  font-size: 28rpx;
  background: #fff;
}

/* 保险上传 */
.insurance-upload {
  height: 120rpx;
  border: 2rpx dashed #d9d9d9;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;

  &.uploading {
    border-color: #007aff;
    background: #f0f9ff;
  }
}

.insurance-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.insurance-text {
  font-size: 24rpx;
  color: #666;
}

.insurance-preview {
  position: relative;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.insurance-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.insurance-actions {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  display: flex;
  gap: 10rpx;
}

.action-btn {
  padding: 8rpx 15rpx;
  font-size: 22rpx;
  border-radius: 4rpx;
  cursor: pointer;

  &.delete {
    background: rgba(255, 77, 79, 0.8);
    color: #fff;
  }

  &.reupload {
    background: rgba(0, 122, 255, 0.8);
    color: #fff;
  }
}

.error-message {
  margin-top: 10rpx;
  padding: 8rpx;
  background: #fff2f0;
  border: 1rpx solid #ffccc7;
  border-radius: 4rpx;
  text-align: center;

  text {
    font-size: 22rpx;
    color: #ff4d4f;
  }
}

/* 添加员工按钮 */
.add-employee-button {
  background: #007aff;
  color: #fff;
  text-align: center;
  padding: 25rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  cursor: pointer;
}

/* 审核信息 */
.approval-item {
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.approval-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.approval-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.approval-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 15rpx;
}

.approval-section {
  margin-top: 20rpx;
}

.vehicle-info-section,
.tools-info-section {
  margin-bottom: 30rpx;
}

.info-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 15rpx;
  display: block;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
  width: 200rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.info-input {
  width: 100%;
  height: 60rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  padding: 0 15rpx;
  font-size: 28rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

/* Excel文件上传样式 */
.excel-upload-container {
  margin-bottom: 30rpx;
}

.excel-upload-area {
  height: 120rpx;
  border: 2rpx dashed #d9d9d9;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007aff;
    background: #f0f9ff;
  }
}

.excel-upload-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
  color: #666;
}

.excel-upload-text {
  font-size: 26rpx;
  color: #666;
}

.excel-file-display {
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  padding: 20rpx;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.file-icon {
  font-size: 32rpx;
  margin-right: 15rpx;
  color: #52c41a;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
  font-weight: 500;
}

.file-size {
  font-size: 22rpx;
  color: #999;
}

.file-actions {
  display: flex;
  gap: 15rpx;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 8rpx 12rpx;
  border-radius: 4rpx;
  cursor: pointer;
  transition: all 0.2s ease;

  &.download {
    background: #007aff;
    color: #fff;

    &:hover {
      background: #0056cc;
    }
  }

  &.remove {
    background: #ff4d4f;
    color: #fff;

    &:hover {
      background: #d32f2f;
    }
  }
}

.action-icon {
  font-size: 20rpx;
  margin-right: 6rpx;
}

.action-text {
  font-size: 22rpx;
}

/* 响应式调整 */
@media (max-width: 750rpx) {
  .dual-column {
    flex-direction: column;
    gap: 0;
  }

  .vehicle-input-row {
    flex-direction: column;
    align-items: stretch;
  }

  .vehicle-label {
    width: auto;
    margin-bottom: 10rpx;
  }

  .vehicle-input {
    margin: 0;
  }
}
</style>
