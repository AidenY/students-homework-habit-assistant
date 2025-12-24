<template>
  <view class="page start-page">
    <view class="hero">
      <image class="hero-image" src="/static/logo.png" mode="aspectFit"></image>
      <view class="hero-text">
        <text class="hero-title">准备好一起写作业了吗？</text>
        <text class="hero-subtitle">选一个合适的时间，专心完成本次小任务～</text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">预计专注时长</view>
      <view class="duration-options">
        <view
          v-for="option in durationOptions"
          :key="option"
          class="duration-item"
          :class="{ active: option === selectedDuration }"
          @tap="selectDuration(option)"
        >
          <text class="duration-value">{{ option }} 分钟</text>
        </view>
      </view>
    </view>

    <view class="card tips-card">
      <view class="card-title">小贴士</view>
      <text class="tips-text">保持坐姿端正，准备好文具，关掉会打扰你的设备，我们一起加油！</text>
    </view>

    <view class="bottom-area">
      <button
        class="primary-btn"
        type="primary"
        hover-class="primary-btn-hover"
        hover-stay-time="80"
        @tap="startSession"
      >
        开始写作业
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      durationOptions: [30, 45, 60],
      selectedDuration: 30
    }
  },
  methods: {
    selectDuration(option) {
      this.selectedDuration = option
    },
    startSession() {
      const startTime = Date.now()
      const expectedDuration = this.selectedDuration * 60 * 1000

      uni.navigateTo({
        url:
          '/pages/session/doing?startTime=' +
          startTime +
          '&expectedDuration=' +
          expectedDuration
      })
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #e6f3ff, #ffffff);
  max-width: 750rpx;
  margin: 0 auto;
}
.hero {
  display: flex;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.hero-image {
  width: 140rpx;
  height: 140rpx;
  margin-right: 24rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
}

.hero-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #2c405a;
  margin-bottom: 8rpx;
}

.hero-subtitle {
  font-size: 26rpx;
  color: #555555;
}

.card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #2c405a;
  margin-bottom: 16rpx;
}

.duration-options {
  display: flex;
  justify-content: space-between;
}

.duration-item {
  flex: 1;
  margin-right: 16rpx;
  padding: 20rpx 0;
  border-radius: 20rpx;
  background-color: #f5f7fb;
  align-items: center;
  justify-content: center;
  display: flex;
  transition: transform 0.12s ease-out, background-color 0.18s ease-out;
}

.duration-item:last-child {
  margin-right: 0;
}

.duration-item.active {
  background: linear-gradient(135deg, #4ba3ff, #73d5ff);
}

.duration-item.active .duration-value {
  color: #ffffff;
}

.duration-value {
  font-size: 30rpx;
  color: #2c405a;
}

.tips-card .tips-text {
  font-size: 26rpx;
  color: #3f536e;
  line-height: 1.5;
}

.bottom-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
}

.primary-btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #4ba3ff, #2f80ff);
  box-shadow: 0 10rpx 24rpx rgba(47, 128, 255, 0.4);
  font-size: 32rpx;
  transition: transform 0.12s ease-out, box-shadow 0.18s ease-out,
    opacity 0.12s ease-out;
}

.primary-btn-hover {
  transform: scale(0.97);
  box-shadow: 0 6rpx 16rpx rgba(47, 128, 255, 0.4);
  opacity: 0.95;
}
</style>


