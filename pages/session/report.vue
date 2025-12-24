<template>
  <view class="page report-page" v-if="session">
    <view class="score-card">
      <view class="score-circle">
        <text class="score-value">{{ session.scores.overall }}</text>
      </view>
      <view class="score-text">
        <text class="score-title">本次作业综合评分</text>
        <text class="score-subtitle">{{ summaryTitle }}</text>
      </view>
    </view>

    <view class="card sub-score-card">
      <view class="sub-score-item">
        <text class="sub-score-label">专注</text>
        <text class="sub-score-value">{{ session.scores.focus }}</text>
      </view>
      <view class="sub-score-item">
        <text class="sub-score-label">坐姿与习惯</text>
        <text class="sub-score-value">{{ session.scores.posture }}</text>
      </view>
      <view class="sub-score-item">
        <text class="sub-score-label">效率</text>
        <text class="sub-score-value">{{ session.scores.efficiency }}</text>
      </view>
    </view>

    <view class="card stats-card">
      <view class="stats-row">
        <view class="stats-item">
          <text class="stats-label">总时长</text>
          <text class="stats-value">{{ durationText }}</text>
        </view>
        <view class="stats-item">
          <text class="stats-label">专注时长</text>
          <text class="stats-value">{{ focusDurationText }}</text>
        </view>
      </view>
      <view class="stats-row">
        <view class="stats-item">
          <text class="stats-label">走神次数</text>
          <text class="stats-value">{{ session.distractCount }}</text>
        </view>
        <view class="stats-item">
          <text class="stats-label">提醒次数</text>
          <text class="stats-value">{{ session.reminderCount }}</text>
        </view>
      </view>
    </view>

    <view class="card summary-card">
      <text class="summary-title">老师的话</text>
      <text class="summary-text">{{ session.notesSummary }}</text>
    </view>

    <!-- 照片回看区域 -->
    <view v-if="photos && photos.length > 0" class="card photos-card">
      <view class="photos-header">
        <text class="photos-title">📷 作业过程照片</text>
        <text class="photos-count">共 {{ photos.length }} 张</text>
      </view>
      <scroll-view class="photos-scroll" scroll-x="true" show-scrollbar="false">
        <view class="photos-list">
          <view
            v-for="(photo, index) in photos"
            :key="index"
            class="photo-item"
            @tap="previewPhoto(index)"
          >
            <image
              class="photo-thumb"
              :src="photo.path"
              mode="aspectFill"
            ></image>
            <view class="photo-badge">
              <text class="photo-badge-text">第{{ index + 1 }}张</text>
            </view>
            <view class="photo-time">
              <text class="photo-time-text">{{ formatPhotoTime(photo.elapsedTime) }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="bottom-area">
      <button
        class="secondary-btn"
        hover-class="secondary-btn-hover"
        hover-stay-time="80"
        @tap="goHistory"
      >
        查看历史记录
      </button>
      <button
        class="primary-btn"
        hover-class="primary-btn-hover"
        hover-stay-time="80"
        @tap="goHome"
      >
        返回首页
      </button>
    </view>
  </view>
</template>

<script>
import { getSessionById, addSession } from '@/common/storageService.js'
import { buildSessionResult } from '@/common/scoringService.js'
import { formatDuration } from '@/common/timeUtils.js'
import { getPhotosBySession } from '@/common/photoStorage.js'

export default {
  data() {
    return {
      session: null,
      photos: [] // 照片列表
    }
  },
  computed: {
    durationText() {
      if (!this.session) return ''
      return formatDuration(this.session.duration)
    },
    focusDurationText() {
      if (!this.session) return ''
      return formatDuration(this.session.focusDuration)
    },
    summaryTitle() {
      if (!this.session) return ''
      const score = this.session.scores.overall
      if (score >= 90) return '表现非常棒，继续保持！'
      if (score >= 75) return '整体不错，还有提升空间～'
      if (score >= 60) return '已经在进步啦，再多一点专注会更好。'
      return '别灰心，下次注意坐姿和专注度，我们一起进步！'
    }
  },
  async onLoad(query) {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
    if (eventChannel && eventChannel.on) {
      eventChannel.on('sessionFinished', async payload => {
        const session = buildSessionResult(payload)
        // 保存照片到 session 中（从 payload 获取，如果为空则从数据库读取）
        if (payload.photos && payload.photos.length > 0) {
          session.photos = payload.photos
          this.photos = payload.photos
        } else {
          // 从数据库读取照片
          try {
            const photos = await getPhotosBySession(session.id)
            session.photos = photos
            this.photos = photos
          } catch (err) {
            console.error('从数据库读取照片失败', err)
            this.photos = []
          }
        }
        addSession(session)
        this.session = session
      })
    }

    // 如果是从历史记录进入，根据 sessionId 拉取
    if (query && query.sessionId) {
      console.log('从历史记录进入，sessionId:', query.sessionId)
      const existing = getSessionById(query.sessionId)
      if (existing) {
        this.session = existing
        console.log('找到会话记录', existing.id)
        
        // 从数据库读取照片
        try {
          console.log('开始从数据库读取照片，sessionId:', query.sessionId)
          const photos = await getPhotosBySession(query.sessionId)
          console.log('从数据库读取到照片', photos.length, '张', photos)
          this.photos = photos
          
          // 如果数据库中有照片，更新 session 中的照片
          if (photos && photos.length > 0) {
            this.session.photos = photos
          }
        } catch (err) {
          console.error('从数据库读取照片失败', err)
          // 降级：使用 session 中保存的照片
          this.photos = existing.photos || []
          console.log('使用 session 中保存的照片', this.photos.length, '张')
        }
      } else {
        console.warn('未找到会话记录，sessionId:', query.sessionId)
      }
    }
  },
  methods: {
    goHome() {
      uni.switchTab({
        url: '/pages/index/index',
        fail: () => {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    },
    goHistory() {
      uni.navigateTo({
        url: '/pages/history/list'
      })
    },
    /**
     * 预览照片
     */
    previewPhoto(index) {
      const urls = this.photos.map(photo => photo.path)
      uni.previewImage({
        current: index,
        urls: urls,
        fail: (err) => {
          console.error('预览图片失败', err)
          uni.showToast({
            title: '预览图片失败',
            icon: 'none'
          })
        }
      })
    },
    /**
     * 格式化照片时间显示
     */
    formatPhotoTime(elapsedTime) {
      const totalSeconds = Math.floor(elapsedTime / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      
      if (minutes > 0) {
        return `${minutes}分${seconds}秒`
      } else {
        return `${seconds}秒`
      }
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx 160rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #e6f3ff, #ffffff);
  max-width: 750rpx;
  margin: 0 auto;
}
.score-card {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.score-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  background: linear-gradient(135deg, #4ba3ff, #2f80ff);
  align-items: center;
  justify-content: center;
  display: flex;
  box-shadow: 0 10rpx 28rpx rgba(47, 128, 255, 0.4);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.score-value {
  font-size: 54rpx;
  font-weight: 700;
  color: #ffffff;
}

.score-text {
  flex: 1;
  margin-left: 24rpx;
}

.score-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #2c405a;
  margin-bottom: 8rpx;
}

.score-subtitle {
  font-size: 26rpx;
  color: #555555;
}

.card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.16s ease-out, box-shadow 0.2s ease-out;
}

.sub-score-card {
  display: flex;
  justify-content: space-between;
}

.sub-score-item {
  flex: 1;
  margin-right: 16rpx;
}

.sub-score-item:last-child {
  margin-right: 0;
}

.sub-score-label {
  font-size: 24rpx;
  color: #555555;
}

.sub-score-value {
  display: block;
  margin-top: 6rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #2c405a;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.stats-item {
  flex: 1;
  margin-right: 16rpx;
}

.stats-item:last-child {
  margin-right: 0;
}

.stats-label {
  font-size: 24rpx;
  color: #555555;
}

.stats-value {
  display: block;
  margin-top: 6rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #2c405a;
}

.summary-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c405a;
  margin-bottom: 12rpx;
}

.summary-text {
  font-size: 26rpx;
  color: #3f536e;
  line-height: 1.6;
}

.bottom-area {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.primary-btn {
  margin-left: 16rpx;
  background: linear-gradient(135deg, #4ba3ff, #2f80ff);
  color: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(47, 128, 255, 0.4);
  transition: transform 0.12s ease-out, box-shadow 0.18s ease-out,
    opacity 0.12s ease-out;
}

.secondary-btn {
  margin-right: 16rpx;
  background-color: #ffffff;
  color: #2f80ff;
  border: 2rpx solid #a8c9ff;
  transition: transform 0.12s ease-out, opacity 0.12s ease-out,
    border-color 0.18s ease-out;
}

.primary-btn-hover {
  transform: scale(0.97);
  box-shadow: 0 6rpx 16rpx rgba(47, 128, 255, 0.4);
  opacity: 0.95;
}

.secondary-btn-hover {
  transform: scale(0.97);
  opacity: 0.95;
  border-color: #4ba3ff;
}

/* 照片回看样式 */
.photos-card {
  padding: 24rpx;
}

.photos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.photos-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2c405a;
}

.photos-count {
  font-size: 24rpx;
  color: #999999;
}

.photos-scroll {
  width: 100%;
  white-space: nowrap;
}

.photos-list {
  display: flex;
  flex-direction: row;
}

.photo-item {
  position: relative;
  margin-right: 16rpx;
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #f5f5f5;
  flex-shrink: 0;
}

.photo-item:last-child {
  margin-right: 0;
}

.photo-thumb {
  width: 100%;
  height: 100%;
}

.photo-badge {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  background-color: rgba(47, 128, 255, 0.9);
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
}

.photo-badge-text {
  font-size: 18rpx;
  color: #ffffff;
  font-weight: 600;
}

.photo-time {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7));
  padding: 8rpx;
}

.photo-time-text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>


