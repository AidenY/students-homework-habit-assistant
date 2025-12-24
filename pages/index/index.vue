<template>
  <view class="home-page">
    <view class="header">
      <view class="title-wrap">
        <text class="app-title">作业习惯小助手</text>
        <text class="app-subtitle">帮孩子养成专注、健康的写作业习惯</text>
      </view>
      <image class="header-logo" src="/static/logo.png" mode="aspectFit"></image>
    </view>

    <view class="content-area">
      <view
        class="start-button"
        hover-class="start-button-hover"
        hover-stay-time="80"
        @tap="goStart"
      >
        <view class="start-icon-wrapper">
          <text class="start-icon">▶</text>
        </view>
        <text class="start-text">开始写作业</text>
      </view>
    </view>

    <view class="bottom-area">
      <view
        class="history-button"
        hover-class="history-button-hover"
        hover-stay-time="80"
        @tap="goHistory"
      >
        <text class="history-icon">≡</text>
        <text class="history-text">历史记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goStart() {
      uni.navigateTo({
        url: '/pages/session/start'
      })
    },
    goHistory() {
      uni.navigateTo({
        url: '/pages/history/list'
      })
    }
  }
}
</script>

<style>
.home-page {
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #e6f3ff, #ffffff);
  max-width: 750rpx;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.title-wrap {
  flex: 1;
  padding-right: 24rpx;
}

.app-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #2c405a;
}

.app-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #555555;
}

.header-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
}

.content-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 0;
}

.start-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.start-icon-wrapper {
  width: 240rpx;
  height: 240rpx;
  border-radius: 120rpx;
  background: linear-gradient(135deg, #4ba3ff, #73d5ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 40rpx rgba(75, 163, 255, 0.3);
  margin-bottom: 32rpx;
}

.start-icon {
  font-size: 100rpx;
  color: #ffffff;
  font-weight: 300;
}

.start-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #2c405a;
}

.start-button-hover {
  transform: scale(0.95);
  opacity: 0.9;
}

.bottom-area {
  flex-shrink: 0;
  padding-bottom: 32rpx;
}

.history-button {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: transform 0.12s ease-out, box-shadow 0.18s ease-out,
    background-color 0.18s ease-out;
}

.history-icon {
  font-size: 36rpx;
  color: #2f80ff;
  font-weight: 500;
}

.history-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #2c405a;
}

.history-button-hover {
  transform: scale(0.97);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  opacity: 0.96;
}
</style>
