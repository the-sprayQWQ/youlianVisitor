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

<style lang="less" scoped>

</style>
