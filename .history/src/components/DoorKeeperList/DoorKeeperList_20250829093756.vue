<script lang="ts" setup>

</script>

<template>
  <view v-for="item in visitorList" :key="item.id" class="visitor-item">
    <!-- 申请单号和状态 -->
    <view class="item-header">
      <text class="item-id">申请单号: {{ item.id }}</text>
      <view class="status-tag">
        待审核
      </view>
    </view>

    <!-- 访客信息 -->
    <view class="item-content">
      <view class="visitor-name">
        {{ item.name }}
      </view>
      <view class="visitor-info">
        <text class="info-text">身份证: {{ item.phone }}</text>
      </view>
      <view class="visitor-info">
        <text class="info-text">申请类型: {{ item.type }}</text>
      </view>
      <view class="visitor-info">
        <text class="info-text">申请时间: {{ item.time }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="item-actions">
      <view class="action-tag">
        <view class="i-carbon-document-requirements btn-icon" />
        审批
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
