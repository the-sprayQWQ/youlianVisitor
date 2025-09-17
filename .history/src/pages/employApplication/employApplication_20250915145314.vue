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
import { getYlfkApplicationDetail } from '@/api/role'
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
    goodsInfo: '',
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

function isNotLoading(index) {
  try {
    return !getEmployeeUploader(index).loading.value
  }
  catch {
    return true
  }
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
const currentNode = ref('')
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
  console.log(e, '参数')
  await getDepartList()
  if (e.applyId) {
    applyId.value = e.applyId
    const res = await getYlfkApplicationDetail(e.applyId, e.applicationType)
  }
  if (e.roleType === '访客') {
    isShow.value = false
  }
})

const uploadedExcelFile = ref(null)

function selectExcelFile() {
  // 文件选择逻辑
}

function downloadExcelFile() {
  // 下载逻辑
}

function removeExcelFile() {
  uploadedExcelFile.value = null
}
</script>

<template>
  <view class="container">
    <scroll-view class="content" scroll-y>
      <form>
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

                <!-- 如果没有上传图片，显示上传区域 -->
                <view
                  v-if="!employee.insurance"
                  class="upload-area"
                  :class="{
                    uploading: getEmployeeUploader(index).loading.value,
                  }"
                  @click="uploadInsurance(index)"
                >
                  <view
                    v-if="isNotLoading(index)"
                    class="i-carbon-cloud-upload text-24px text-gray-400"
                  />
                  <view v-else class="loading-spinner">
                    <view
                      class="i-carbon-loading rotating text-24px text-gray-400"
                    />
                  </view>
                  <text class="upload-text">
                    {{
                      getEmployeeUploader(index).loading.value
                        ? "上传中..."
                        : "点击上传商业保险图片"
                    }}
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
                  <view class="image-overlay">
                    <view
                      class="action-btn delete-btn"
                      @click.stop="deleteInsurance(index)"
                    >
                      <view class="i-carbon-close text-16px" />
                    </view>
                    <view
                      class="action-btn reupload-btn"
                      @click.stop="uploadInsurance(index)"
                    >
                      <view class="i-carbon-refresh text-16px" />
                    </view>
                  </view>
                  <view class="preview-tip">
                    点击预览
                  </view>
                </view>

                <!-- 上传失败提示 -->
                <view v-if="!isNotLoading(index)" class="error-tip">
                  <text>上传失败，请重试</text>
                </view>
              </view>
            </view>
          </view>

          <button type="button" class="add-employee-btn" @click="addEmployee">
            <view class="i-carbon-add text-16px text-white" />
            <text>添加员工</text>
          </button>
        </view>

        <!-- 车辆信息 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title">
              车辆信息 <text class="required">*</text>
            </text>
          </view>

          <view class="vehicle-info">
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
          <view class="excel-upload-container">
            <!-- 未上传状态 -->
            <view
              v-if="!uploadedExcelFile"
              class="excel-upload-area"
              @click="selectExcelFile"
            >
              <text class="upload-icon">📊</text>
              <text class="upload-text">导入工具/物资信息列表</text>
            </view>

            <!-- 已上传状态 -->
            <view v-else class="excel-file-display">
              <view class="file-info">
                <text class="file-icon">📄</text>
                <text class="file-name">{{ uploadedExcelFile.name }}</text>
              </view>
              <view class="file-actions">
                <text class="download-btn" @click="downloadExcelFile">
                  下载
                </text>
                <text class="delete-btn" @click="removeExcelFile">删除</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 审核信息 -->
        <view v-if="applyId" class="form-section">
          <text class="section-title">审核信息</text>

          <!-- 部门经理审核 -->
          <view class="approval-card">
            <text class="approval-title">归口管理部门经理室审核</text>
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

          <view class="approval-card">
            <text class="approval-title">行政部审核</text>
            <label class="approval-checkbox">
              <checkbox
                :checked="form.hrApproval"
                color="#3B82F6"
                @change="onHrApprovalChange"
              />
              <text>我已办理预住手续</text>
            </label>
          </view>
          <!-- 门卫入厂审核 -->
          <view class="approval-card">
            <text class="approval-title">门卫入厂审核</text>

            <!-- 车辆信息 -->
            <view class="guard-section">
              <text class="section-label">车辆信息</text>

              <view class="info-row">
                <text class="info-label">车牌号：</text>
                <text class="info-value">无</text>
              </view>

              <view class="info-row">
                <text class="info-label">临时通行证号</text>
                <input
                  type="text"
                  placeholder="请输入临时通行证号"
                  class="guard-input"
                >
              </view>

              <!-- 车辆照片上传 -->
              <view class="upload-section">
                <text class="upload-label">车辆照片</text>
                <view class="guard-upload-area">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传车辆照片</text>
                </view>
              </view>
            </view>

            <!-- 工具/物资信息 -->
            <view class="guard-section">
              <text class="section-label">工具/物资信息</text>

              <view class="info-row">
                <text class="info-label">工具/物资清单：</text>
              </view>

              <input
                type="text"
                placeholder="数量/物资清单"
                class="guard-input"
              >

              <!-- 物资照片上传 -->
              <view class="upload-section">
                <text class="upload-label">物资照片</text>
                <view class="guard-upload-area">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传物资照片</text>
                </view>
              </view>
            </view>

            <!-- 确认复选框 -->
            <view class="guard-checkbox">
              <checkbox color="#007AFF" />
              <text class="checkbox-text">我已确认入厂车辆物资信息完整</text>
            </view>
          </view>

          <view class="approval-card">
            <text class="approval-title">门卫离厂审核</text>

            <!-- 车辆信息 -->
            <view class="guard-section">
              <text class="section-label">车辆信息</text>

              <view class="info-row">
                <text class="info-label">车牌号：</text>
                <text class="info-value">-</text>
              </view>

              <view class="info-row">
                <text class="info-label">临时通行证号：</text>
                <text class="info-value">-</text>
              </view>

              <!-- 归还通行证复选框 -->
              <view class="guard-checkbox">
                <checkbox color="#007AFF" />
                <text class="checkbox-text">已归还临时通行证</text>
              </view>

              <!-- 离厂车辆照片上传 -->
              <view class="upload-section">
                <text class="upload-label">离厂车辆照片</text>
                <view class="guard-upload-area">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传离厂车辆照片</text>
                </view>
              </view>
            </view>

            <!-- 工具/物资信息 -->
            <view class="guard-section">
              <text class="section-label">工具/物资信息</text>

              <view class="info-row">
                <text class="info-label">物资清单：</text>
              </view>

              <input
                type="text"
                placeholder="数量/物资清单"
                class="guard-input"
              >

              <!-- 离厂物资照片上传 -->
              <view class="upload-section">
                <text class="upload-label">离厂物资照片</text>
                <view class="guard-upload-area">
                  <text class="upload-icon">📷</text>
                  <text class="upload-text">上传离厂物资照片</text>
                </view>
              </view>
            </view>

            <!-- 确认复选框 -->
            <view class="guard-checkbox">
              <checkbox color="#007AFF" />
              <text class="checkbox-text">我已确认离厂信息完整</text>
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
  padding: 20rpx 32rpx;
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
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    background-color: #f0f9ff;
  }
  &.uploading {
    border-color: #3b82f6;
    background-color: #f0f9ff;
    pointer-events: none;
  }
}

.upload-text {
  font-size: 24rpx;
  color: #6b7280;
  margin-top: 8rpx;
  text-align: center;
}

.loading-spinner {
  .rotating {
    animation: spin 1s linear infinite;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.insurance-preview {
  position: relative;
  height: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.insurance-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
}

/* 图片操作按钮覆盖层 */
.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8rpx;
  padding: 8rpx;
  background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
}

.action-btn {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16rpx;
  cursor: pointer;
  transition: all 0.2s ease;

  &.delete-btn {
    background-color: rgba(239, 68, 68, 0.8);

    &:hover {
      background-color: rgba(220, 38, 38, 0.9);
      transform: scale(1.1);
    }
  }

  &.reupload-btn {
    background-color: rgba(59, 130, 246, 0.8);

    &:hover {
      background-color: rgba(37, 99, 235, 0.9);
      transform: scale(1.1);
    }
  }
}

/* 预览提示 */
.preview-tip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
  text-align: center;
  padding: 8rpx;
  font-size: 20rpx;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.insurance-preview:hover .preview-tip {
  opacity: 1;
}

/* 错误提示 */
.error-tip {
  margin-top: 8rpx;
  padding: 8rpx 12rpx;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4rpx;
  text-align: center;

  text {
    color: #dc2626;
    font-size: 22rpx;
  }
}

/* 移除原来不需要的样式 */
.file-input {
  display: none;
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

.excel-upload-container {
  margin-bottom: 30rpx;
}

.excel-upload-area {
  height: 100rpx;
  border: 2rpx dashed #d9d9d9;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  gap: 15rpx;
}

.upload-icon {
  font-size: 28rpx;
  color: #999;
}

.upload-text {
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
  gap: 15rpx;
}

.file-icon {
  font-size: 28rpx;
  color: #52c41a;
}

.file-name {
  font-size: 28rpx;
  color: #333;
}

.file-actions {
  display: flex;
  gap: 15rpx;
}

.download-btn,
.delete-btn {
  padding: 8rpx 15rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  cursor: pointer;
}

.download-btn {
  background: #007aff;
  color: #fff;
}

.delete-btn {
  background: #ff4d4f;
  color: #fff;
}

.guard-section {
  margin-bottom: 30rpx;

  &:last-of-type {
    margin-bottom: 20rpx;
  }
}

.section-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 15rpx;
  display: block;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  min-width: 180rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.guard-input {
  width: 100%;
  height: 60rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  padding: 0 15rpx;
  font-size: 26rpx;
  margin-bottom: 15rpx;
  background: #fff;
}

.upload-section {
  margin-top: 15rpx;
}

.upload-label {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.guard-upload-area {
  height: 80rpx;
  border: 2rpx dashed #d9d9d9;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  gap: 10rpx;
  margin-bottom: 15rpx;
}

.upload-icon {
  font-size: 24rpx;
  color: #999;
}

.upload-text {
  font-size: 24rpx;
  color: #666;
}

.guard-checkbox {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.checkbox-text {
  font-size: 26rpx;
  color: #333;
  margin-left: 10rpx;
}
/* 如果需要区分离厂审核的特殊样式 */
.guard-exit-section {
  .info-label {
    min-width: 220rpx; /* 稍微增加宽度适应"临时通行证号："文字 */
  }
}

/* 离厂确认复选框的特殊间距 */
.exit-confirmation {
  margin-top: 25rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}
</style>
