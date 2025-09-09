<script lang="ts" setup>
import { ref } from 'vue'
import { getAllDepartment } from '../../api/sys'
import { uploadFileUrl, useUpload } from '../../utils/uploadFile'

const props = defineProps({
  applyId: {
    type: String,
  },
  value: {
    type: Array as PropType<number[]>,
  },
  disabled: {
    type: Boolean,
  },
})
const form = defineModel('form', {
  type: Object,
  required: true,
})

// 关联申请单
const hasRelatedOptions = ref([
  { label: '否', value: '0' },
  { label: '是', value: '1' },
])
const relatedApplicationNumber = ref('')
const hasRelatedOption = ref(hasRelatedOptions.value[0])
function onHasRelatedChange(e: any) {
  hasRelatedOption.value = hasRelatedOptions.value[e.detail.value]
}
const departments = ref([])
const selectedDepartment = ref()
const departmentContact = ref('')
const departmentContactPhone = ref('')

const value = ref<number[]>([])
function onDepartmentChange(e: any) {
  selectedDepartment.value = departments.value[e.detail.value]
  form.value.ylfkApplicationPage.visitorDept = selectedDepartment.value.value
}

// 车辆信息
const hasCarOptions = ref([
  { label: '否', value: '否' },
  { label: '是', value: '是' },
])
const hasCarOption = ref(hasCarOptions.value[0])

function onHasCarChange(e: any) {
  hasCarOption.value = hasCarOptions.value[e.detail.value]
  console.log(hasCarOptions.value[e.detail.value])
  form.value.ylfkApplicationPage.isCard = hasCarOption.value.value
}

// 物资信息
const hasMaterialsOptions = ref([
  { label: '否', value: '否' },
  { label: '是', value: '是' },
])
const hasMaterialsOption = ref(hasMaterialsOptions.value[0])

function onHasMaterialsChange(e: any) {
  hasMaterialsOption.value = hasMaterialsOptions.value[e.detail.value]
  form.value.ylfkApplicationPage.isGoods = hasMaterialsOptions.value[e.detail.value].value
}

// 车辆全景照上传
const {
  loading: carPhotoLoading,
  error: carPhotoError,
  data: carPhotoData,
  progress: carPhotoProgress,
  run: runCarUpload,
} = useUpload(
  uploadFileUrl.USER_AVATAR, // 或者你的图片上传接口
  {},
  {
    maxSize: 5, // 5MB限制
    onSuccess: (res) => {
      // 将上传成功的URL存储到表单中
      console.log(res, 'res')
      form.value.ylfkApplicationPage.carImage = res.message
      console.log('车辆照片上传成功:', res)
    },
    onError: (err) => {
      console.error('车辆照片上传失败:', err)
      uni.showToast({
        title: '车辆照片上传失败',
        icon: 'none',
      })
    },
  },
)

// 物资照片上传
const {
  loading: materialsPhotoLoading,
  error: materialsPhotoError,
  data: materialsPhotoData,
  progress: materialsPhotoProgress,
  run: runMaterialsUpload,
} = useUpload(
  uploadFileUrl.USER_AVATAR, // 或者你的图片上传接口
  {},
  {
    maxSize: 5, // 5MB限制
    onSuccess: (res) => {
      // 将上传成功的URL存储到表单中
      form.value.ylfkApplicationPage.goodsImage = res.message
      console.log('物资照片上传成功:', res)
    },
    onError: (err) => {
      console.error('物资照片上传失败:', err)
      uni.showToast({
        title: '物资照片上传失败',
        icon: 'none',
      })
    },
  },
)
// 替换上传函数
function uploadCarPhoto() {
  if (carPhotoLoading.value)
    return
  runCarUpload()
}

function uploadMaterialsPhoto() {
  if (materialsPhotoLoading.value)
    return
  runMaterialsUpload()
}

// 删除照片功能
function deleteCarPhoto() {
  form.value.ylfkApplicationPage.carImage = ''
}

function deleteMaterialsPhoto() {
  form.value.ylfkApplicationPage.goodsImage = ''
}

const idTypes = ref([
  { name: '身份证', value: '身份证' },
  { name: '护照', value: '护照' },
])

function addPerson() {
  form.value.ylfkApplicationPage.ylfkApplicationUserList.unshift({
    name: '',
    phone: '',
    cardType: '',
    idCard: '',
    visitorNumber: '',
    applicationStatus: '',
    carNumber: '',
    enterTime: '',
    leaveTime: '',
  })
}
function onIdTypeChange(index: number, e: any) {
  // personList.value[index].idType = idTypes.value[e.detail.value]
  form.value.ylfkApplicationPage.ylfkApplicationUserList[index].cardType
    = idTypes.value[e.detail.value].value
}

function deletePerson(index: number) {
  if (form.value.ylfkApplicationPage.ylfkApplicationUserList.length <= 1) {
    uni.showToast({
      title: '至少保留一位访客',
      icon: 'none',
    })
    return
  }

  uni.showModal({
    title: '提示',
    content: '确定要删除该人员信息吗？',
    success: (res) => {
      if (res.confirm) {
        form.value.ylfkApplicationPage.ylfkApplicationUserList.splice(index, 1)
      }
    },
  })
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
  form.value.ylfkApplicationPage.startTime = formatTimeStamp(value[0])
  form.value.ylfkApplicationPage.endTime = formatTimeStamp(value[1])
}
async function getDepartList() {
  const res = await getAllDepartment()
  if (res.result) {
    departments.value = res.result.map(item => ({
      label: item,
      value: item,
    }))
  }
}

watch(
  () => props.value,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      value.value = newValue
    }
  },
  { immediate: true },
)
defineExpose({
  getDepartList,
})
</script>

<template>
  <view>
    <view class="form-section">
      <!-- 关联申请单 -->
      <view class="grid-2-col">
        <view>
          <text class="label">是否关联申请单</text>
          <picker
            mode="selector"
            :range="hasRelatedOptions"
            range-key="label"
            :disabled="props.disabled"
            @change="onHasRelatedChange"
          >
            <view class="picker">
              {{ hasRelatedOption.label }}
            </view>
          </picker>
        </view>
        <view v-if="hasRelatedOption.value === '1'" class="related-application">
          <text class="label required">关联申请单号</text>
          <input
            v-model="relatedApplicationNumber"
            :disabled="props.disabled"
            class="input"
            type="text"
            placeholder="请输入申请单号"
          >
        </view>
      </view>

      <!-- 申请人信息 -->
      <view class="grid-2-col">
        <view>
          <text class="label required">申请人</text>
          <input
            v-model="form.ylfkApplicationPage.user"
            class="input"
            :disabled="props.disabled"
            type="text"
            placeholder="请输入姓名"
          >
        </view>
        <view>
          <text class="label required">联系电话</text>
          <input
            v-model="form.ylfkApplicationPage.phone"
            class="input"
            :disabled="props.disabled"
            type="tel"
            placeholder="请输入电话"
          >
        </view>
      </view>

      <view class="grid-2-col">
        <view>
          <text class="label required">身份证号</text>
          <input
            v-model="form.ylfkApplicationPage.idCard"
            class="input"
            type="text"
            placeholder="请输入身份证号"
            :disabled="props.disabled"
          >
        </view>

        <view>
          <text class="label required">起止时间</text>
          <view class="calendar-wrapper">
            <wd-datetime-picker
              v-model="value"
              ellipsis
              :close-on-click-modal="false"
              :disabled="props.disabled"
              @confirm="handleConfirm"
            />
          </view>
        </view>
      </view>

      <view class="grid-2-col">
        <view>
          <text class="label required">申请单位</text>
          <input
            v-model="form.ylfkApplicationPage.applicationDept"
            class="input"
            type="text"
            placeholder="请输入申请单位"
            :disabled="props.disabled"
          >
        </view>
        <view>
          <text class="label required">拜访部门</text>
          <picker
            mode="selector"
            :range="departments"
            range-key="label"
            :disabled="props.disabled"
            @change="onDepartmentChange"
          >
            <view class="picker">
              {{ selectedDepartment?.label || "请选择拜访部门" }}
            </view>
          </picker>
        </view>
      </view>

      <view class="grid-2-col">
        <view>
          <text class="label required">部门联系人</text>
          <input
            v-model="departmentContact"
            class="input"
            type="text"
            placeholder="请输入姓名"
            :disabled="props.disabled"
          >
        </view>
        <view>
          <text class="label required">部门联系人电话</text>
          <input
            v-model="departmentContactPhone"
            class="input"
            type="tel"
            placeholder="请输入电话"
            :disabled="props.disabled"
          >
        </view>
      </view>

      <view class="grid-2-col">
        <view>
          <text class="label required">是否有随行车辆</text>
          <picker
            mode="selector"
            :range="hasCarOptions"
            range-key="label"
            :disabled="props.disabled"
            @change="onHasCarChange"
          >
            <view class="picker">
              {{ hasCarOption.label }}
            </view>
          </picker>
        </view>
        <view v-if="hasCarOption.label === '是'">
          <text class="label">车牌号</text>
          <input
            v-model="form.ylfkApplicationPage.carCode"
            :disabled="props.disabled"
            class="input"
            type="text"
            placeholder="请输入车牌号"
          >
        </view>
      </view>

      <view class="grid-2-col">
        <view class="col-span-2">
          <text class="label required">是否自带物资</text>
          <picker
            mode="selector"
            :range="hasMaterialsOptions"
            :disabled="props.disabled"
            range-key="label"
            @change="onHasMaterialsChange"
          >
            <view class="picker">
              {{ hasMaterialsOption.label }}
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 上传照片模块 -->
    <view v-if="hasMaterialsOption.label === '是'" class="form-section">
      <view class="grid-2-col">
        <!-- 车辆照片上传 -->
        <view>
          <text class="label required">车辆全景照</text>

          <!-- 如果没有上传图片，显示上传区域 -->
          <view
            v-if="!form.ylfkApplicationPage.carPhotoUrl"
            class="upload-box"
            :class="{ uploading: carPhotoLoading }"
            @click="uploadCarPhoto"
          >
            <view v-if="!carPhotoLoading" i-carbon:camera />
            <view v-else class="loading-spinner">
              <view i-carbon:loading class="rotating" />
            </view>
            <text class="upload-text">
              {{ carPhotoLoading ? `上传中 ${carPhotoProgress}%` : '上传' }}
            </text>
          </view>

          <!-- 如果已上传，显示图片预览 -->
          <view v-else class="uploaded-image-container">
            <image
              :src="form.ylfkApplicationPage.carPhotoUrl"
              mode="aspectFit"
              class="uploaded-image"
            />
            <view class="delete-image-btn" @click="deleteCarPhoto">
              <view i-carbon:close />
            </view>
            <view class="reupload-btn" @click="uploadCarPhoto">
              <text>重新上传</text>
            </view>
          </view>

          <!-- 上传失败提示 -->
          <view v-if="carPhotoError" class="upload-error">
            <text>上传失败，请重试</text>
          </view>
        </view>

        <!-- 物资照片上传 -->
        <view>
          <text class="label required">物资全景照</text>

          <!-- 如果没有上传图片，显示上传区域 -->
          <view
            v-if="!form.ylfkApplicationPage.materialsPhotoUrl"
            class="upload-box"
            :class="{ uploading: materialsPhotoLoading }"
            @click="uploadMaterialsPhoto"
          >
            <view v-if="!materialsPhotoLoading" i-carbon:camera />
            <view v-else class="loading-spinner">
              <view i-carbon:loading class="rotating" />
            </view>
            <text class="upload-text">
              {{ materialsPhotoLoading ? `上传中 ${materialsPhotoProgress}%` : '上传' }}
            </text>
          </view>

          <!-- 如果已上传，显示图片预览 -->
          <view v-else class="uploaded-image-container">
            <image
              :src="form.ylfkApplicationPage.materialsPhotoUrl"
              mode="aspectFit"
              class="uploaded-image"
            />
            <view class="delete-image-btn" @click="deleteMaterialsPhoto">
              <view i-carbon:close />
            </view>
            <view class="reupload-btn" @click="uploadMaterialsPhoto">
              <text>重新上传</text>
            </view>
          </view>

          <!-- 上传失败提示 -->
          <view v-if="materialsPhotoError" class="upload-error">
            <text>上传失败，请重试</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 入厂人员清单模块 -->
    <view class="form-section">
      <view class="flex-row-between">
        <text class="label required">入厂人员清单</text>
        <view class="add-person" @click="addPerson">
          <view i-carbon:add />
          <text class="add-person-text">添加人员</text>
        </view>
      </view>
    </view>
    <view :class="{ 'pb-13': props.applyId === '' }">
      <view
        v-for="(person, index) in form.ylfkApplicationPage.ylfkApplicationUserList"
        :key="index"
        class="person-row"
      >
        <view class="grid-2-col">
          <view>
            <text class="label">姓名</text>
            <input
              v-model="person.name"
              class="input"
              type="text"
              placeholder="请输入姓名"
              :disabled="props.disabled"
            >
          </view>
          <view>
            <text class="label">手机号</text>
            <input
              v-model="person.phone"
              class="input"
              type="tel"
              placeholder="请输入电话"
              :disabled="props.disabled"
            >
          </view>
        </view>

        <view class="grid-2-col">
          <view>
            <text class="label">证件类型</text>
            <picker
              mode="selector"
              :range="idTypes"
              range-key="value"
              :disabled="props.disabled"
              @change="(e) => onIdTypeChange(index, e)"
            >
              <view class="picker">
                {{ person?.cardType || "请选择证件类型" }}
              </view>
            </picker>
          </view>
          <view>
            <text class="label">证件号</text>
            <input
              v-model="person.idCard"
              :disabled="props.disabled"
              class="input"
              type="text"
              placeholder="请输入证件号"
            >
          </view>
        </view>

        <view class="delete-btn" @click="deletePerson(index)">
          <view i-carbon:close-outline />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.calendar-wrapper {
  width: 340rpx;
}
// 表单区域
.form-section {
  padding: 24rpx;
  padding-top: 0;
  padding-bottom: 0;
  .flex-row-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      font-size: 28rpx;
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #1d2129;
    margin-bottom: 20rpx;
    display: block;
  }

  .required {
    &::after {
      content: '*';
      color: #ff4d4f;
      margin-left: 4rpx;
    }
  }

  // 网格布局
  .grid-2-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24rpx;
    margin-bottom: 24rpx;
    .label {
      font-size: 28rpx;
    }

    .col-span-2 {
      grid-column: span 2;
    }
  }

  // 表单元素
  .picker {
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

  .input {
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

  // 上传区域
  // 上传相关样式
  .upload-box {
    width: 160rpx;
    height: 160rpx;
    border: 1px dashed #e5e7eb;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    position: relative;

    &.uploading {
      border-color: #165dff;
      background-color: #f8faff;
    }

    .upload-text {
      color: #165dff;
      font-size: 12px;
      margin-top: 8rpx;
    }

    .loading-spinner {
      .rotating {
        animation: rotate 1s linear infinite;
      }
    }
  }

  .uploaded-image-container {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    overflow: hidden;

    .uploaded-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }

    .delete-image-btn {
      position: absolute;
      top: 4rpx;
      right: 4rpx;
      width: 32rpx;
      height: 32rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .reupload-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      text-align: center;
      padding: 4rpx 0;
      font-size: 20rpx;
    }
  }

  .upload-error {
    margin-top: 8rpx;
    padding: 8rpx;
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 4rpx;

    text {
      color: #ff4d4f;
      font-size: 20rpx;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .add-person {
    display: flex;
    align-items: center;
    color: #165dff;

    .add-person-text {
      font-size: 28rpx;
      margin-left: 8rpx;
    }
  }
}
// 人员清单
.person-row {
  border: 1px solid #e5e7eb;
  border-radius: 8rpx;
  padding: 24rpx;
  width: 702rpx;
  margin: 0 auto;
  margin-top: 24rpx;
  box-sizing: border-box;
  //   margin-bottom: 24rpx;
  background-color: white;
  position: relative;
  &:last-child {
    margin-bottom: 24rpx;
  }
  .grid-2-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24rpx;
    margin-bottom: 24rpx;
    .label {
      color: #86909c;
      font-size: 12px;
    }
    .picker {
      height: 64rpx;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 0 24rpx;
      display: flex;
      align-items: center;
      background-color: white;
    }

    .input {
      height: 64rpx;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 0 24rpx;
      background-color: white;
    }
  }

  .delete-btn {
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    width: 32rpx;
    height: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
