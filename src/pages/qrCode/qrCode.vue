<route lang="jsonc">
{
  "needLogin": true,
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "default",
    "navigationBarTitleText": "申请成功",
  },
}
</route>

<script lang="ts" setup>
import QRCode from 'qrcode-generator'
import { getYlfkApplicationDetail } from '@/api/role'

const userStore = useUserStore()
const telephone = userStore.userInfo.userInfo.phone
const name = ref('')

const applyId = ref('')
const applicationType_DictText = ref('')
const createTime = ref('')
const filterList = ref<any>({})
const qrCodeUrl = ref('')
const showError = ref(false)
// 生成二维码
function generateQRCode() {
  if (!name.value) {
    showError.value = true
    qrCodeUrl.value = ''
    return
  }

  showError.value = false

  // 创建二维码数据对象
  const qrData = {
    phone: telephone,
    applyId: applyId.value,
  }

  try {
    const qr = QRCode(0, 'M')
    qr.addData(JSON.stringify(qrData))
    qr.make()

    const modules = qr.getModuleCount()
    const canvasSize = 400
    const cellSize = Math.floor((canvasSize - 40) / modules)
    const margin = (canvasSize - modules * cellSize) / 2

    // 使用 uni.createCanvasContext 创建画布上下文
    const ctx = uni.createCanvasContext('qrCanvas')

    // 设置画布尺寸
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // 绘制二维码
    ctx.fillStyle = '#000000'
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(col * cellSize + margin, row * cellSize + margin, cellSize, cellSize)
        }
      }
    }

    ctx.draw(false, () => {
      // 导出为临时文件
      uni.canvasToTempFilePath({
        canvasId: 'qrCanvas',
        success: (res) => {
          qrCodeUrl.value = res.tempFilePath
        },
        fail: (error) => {
          console.error('生成二维码失败:', error)
          showError.value = true
          qrCodeUrl.value = ''
        },
      })
    })
  }
  catch (error) {
    console.error('生成二维码失败:', error)
    showError.value = true
    qrCodeUrl.value = ''
  }
}

onLoad(async (e) => {
  applyId.value = e.applyId
  applicationType_DictText.value = e.applicationType_DictText
  createTime.value = e.createTime
  const res = await getYlfkApplicationDetail(e.applyId, e.applicationType)
  if (e.applicationType_DictText === '业务沟通' && res.code === 200) {
    filterList.value = res.result.ylfkApplicationPage
    console.log(filterList.value, 'filter')
  }
  else if (e.applicationType_DictText === '学习交流' && res.code === 200) {
    filterList.value = res.result.ylfkApplicationPage
    console.log(filterList.value, 'filter')
  }

  // 根据telephone与filterList.value.phone进行比较设置name.value
  if (telephone === filterList.value.phone) {
    name.value = filterList.value.user
  }
  else {
    // 在ylfkApplicationUserList数组中查找匹配的phone
    const matchedUser = filterList.value.ylfkApplicationUserList?.find(item => item.phone === telephone)
    if (matchedUser) {
      name.value = matchedUser.name
    }
  }

  // 生成二维码
  nextTick(() => {
    generateQRCode()
  })
})
function navigateToHome() {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
</script>

<template>
  <div class="success-page">
    <div class="success-card">
      <!-- 成功图标 -->
      <div class="success-icon">
        <div class="icon-circle">
          <div class="i-carbon-checkmark check-icon" />
        </div>
      </div>

      <!-- 标题区域 -->
      <div class="title-section">
        <h1 class="main-title">
          申请成功
        </h1>
        <p class="sub-title">
          您的访客申请已通过审核
        </p>
      </div>

      <!-- 申请信息 -->
      <div class="info-section">
        <div class="info-item">
          <span class="label">申请单号</span>
          <span class="value">{{ applyId }}</span>
        </div>

        <div class="info-item">
          <span class="label">访客姓名</span>
          <span class="value">{{ name }}</span>
          <span class="tag">{{ applicationType_DictText }}</span>
        </div>

        <div class="info-item">
          <span class="label">申请日期</span>
          <span class="value">{{ createTime }}</span>
        </div>
      </div>

      <!-- 二维码区域 -->
      <div class="qr-section">
        <div v-if="!showError && qrCodeUrl" class="qr-code">
          <image :src="qrCodeUrl" class="qr-image" mode="aspectFit" />
        </div>
        <div v-else class="qr-error">
          <div class="error-icon">
            <div class="i-carbon-warning warning-icon" />
          </div>
          <div class="error-text">
            {{ showError ? '用户信息获取失败，无法生成二维码' : '二维码生成中...' }}
          </div>
        </div>
      </div>

      <!-- 提示文字 -->
      <div class="tip-text">
        请客备保管二维码，进出时需出示
      </div>

      <!-- 返回按钮 -->
      <div class="button-section">
        <button class="return-btn" @click="navigateToHome">
          返回主页
        </button>
      </div>
    </div>

    <!-- 隐藏的Canvas用于生成二维码 -->
    <canvas canvas-id="qrCanvas" style="position: fixed; top: -9999px; left: -9999px; width: 400px; height: 400px;" />
  </div>
</template>

<style lang="scss" scoped>
.success-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  margin-bottom: 30px;

  .icon-circle {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #4ade80, #22c55e);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 100px;
      height: 100px;
      background: rgba(74, 222, 128, 0.2);
      border-radius: 50%;
      top: -10px;
      left: -10px;
    }

    .check-icon {
      width: 32px;
      height: 32px;
      color: white;
      font-size: 32px;
    }
  }
}

.title-section {
  margin-bottom: 40px;

  .main-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .sub-title {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

.info-section {
  margin-bottom: 40px;
  text-align: left;

  .info-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-size: 14px;
      color: #6b7280;
      width: 80px;
      flex-shrink: 0;
    }

    .value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
      flex: 1;
    }

    .tag {
      background: #dcfce7;
      color: #16a34a;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      margin-left: auto;
    }
  }
}

.qr-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;

  .qr-code {
    width: 120px;
    height: 120px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;

    .qr-image {
      width: 110px;
      height: 110px;
      border-radius: 4px;
      object-fit: contain;
      display: block;
    }
  }

  .qr-error {
    width: 120px;
    height: 120px;
    border: 1px solid #f87171;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fef2f2;

    .error-icon {
      margin-bottom: 8px;

      .warning-icon {
        width: 24px;
        height: 24px;
        color: #f87171;
        font-size: 24px;
      }
    }

    .error-text {
      font-size: 10px;
      color: #dc2626;
      text-align: center;
      line-height: 1.2;
      padding: 0 8px;
    }
  }
}

.tip-text {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 30px;
}

.button-section {
  .return-btn {
    width: 100%;
    height: 48px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: #059669;
    }

    &:active {
      background: #047857;
    }
  }
}

// 响应式适配
@media (max-width: 480px) {
  .success-page {
    padding: 10px;
  }

  .success-card {
    padding: 30px 20px;
  }

  .success-icon .icon-circle {
    width: 60px;
    height: 60px;

    .check-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    &::before {
      width: 80px;
      height: 80px;
      top: -10px;
      left: -10px;
    }
  }
}
</style>
