<template>
  <view class="page history-page">
    <view v-if="sessions.length === 0" class="empty">
      <text class="empty-title">还没有作业记录</text>
      <text class="empty-subtitle">从首页开始一段新的专注时光吧～</text>
    </view>
    <view v-else>
      <view
        v-for="item in sessions"
        :key="item.id"
        class="card session-item"
        hover-class="card-hover"
        hover-stay-time="80"
        @tap="goDetail(item)"
      >
        <view class="session-main">
          <text class="session-date">{{ item.dateText }}</text>
          <text class="session-score">{{ item.scores.overall }} 分</text>
        </view>
        <view class="session-sub">
          <text class="session-duration">时长：{{ item.durationText }}</text>
          <text class="session-tag">{{ buildTag(item) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAllSessions } from '@/common/storageService.js'
import { formatDuration, formatTime } from '@/common/timeUtils.js'

export default {
  data() {
    return {
      sessions: []
    }
  },
  onShow() {
    const all = getAllSessions() || []
    const enhanced = all
      .slice()
      .sort((a, b) => b.startTime - a.startTime)
      .map(s => ({
        ...s,
        dateText: formatTime(s.startTime),
        durationText: formatDuration(s.duration)
      }))
    this.sessions = enhanced
  },
  methods: {
    buildTag(item) {
      const overall = item.scores.overall
      if (overall >= 90) return '状态极佳'
      if (overall >= 75) return '表现不错'
      if (overall >= 60) return '还可以提升'
      return '需要多多努力'
    },
    goDetail(item) {
      uni.navigateTo({
        url: '/pages/session/report?sessionId=' + item.id
      })
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 24rpx 32rpx 40rpx;
  box-sizing: border-box;
  background-color: #f8f8fb;
  max-width: 750rpx;
  margin: 0 auto;
}
.empty {
  margin-top: 160rpx;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c405a;
  margin-bottom: 12rpx;
}

.empty-subtitle {
  font-size: 26rpx;
  color: #555555;
}

.card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.12s ease-out, box-shadow 0.18s ease-out,
    opacity 0.12s ease-out;
}

.session-item {
  display: flex;
  flex-direction: column;
}

.session-main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.session-date {
  font-size: 28rpx;
  color: #2c405a;
}

.session-score {
  font-size: 32rpx;
  font-weight: 600;
  color: #2f80ff;
}

.session-sub {
  display: flex;
  justify-content: space-between;
}

.session-duration {
  font-size: 24rpx;
  color: #555555;
}

.session-tag {
  font-size: 24rpx;
  color: #3f536e;
}

.card-hover {
  transform: scale(0.97);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.12);
  opacity: 0.97;
}
</style>


