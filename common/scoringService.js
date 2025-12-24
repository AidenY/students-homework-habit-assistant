import { createHomeworkSession } from '@/common/models.js'
import { calcDuration } from '@/common/timeUtils.js'

export function calculateStats({ startTime, endTime, snapshots, reminders }) {
  const duration = calcDuration(startTime, endTime)
  const total = snapshots.length || 1

  let focusGoodCount = 0
  let postureGoodCount = 0
  let distractCount = 0

  snapshots.forEach(s => {
    if (s.focusState === 'focus') {
      focusGoodCount += 1
    } else {
      distractCount += 1
    }
    if (s.postureState === 'good') {
      postureGoodCount += 1
    }
  })

  const focusRatio = focusGoodCount / total
  const postureGoodRatio = postureGoodCount / total

  return {
    startTime,
    endTime,
    duration,
    focusDuration: duration * focusRatio,
    distractCount,
    reminderCount: reminders.length,
    postureGoodRatio
  }
}

export function calculateScores(stats) {
  const ratioToScore = ratio => Math.round(60 + Math.max(0, Math.min(1, ratio)) * 40)

  const focusScore = ratioToScore(stats.focusDuration / (stats.duration || 1))
  const postureScore = ratioToScore(stats.postureGoodRatio)

  const planned = stats.expectedDuration || stats.duration || 1
  const efficiencyRatio = stats.duration / planned
  let efficiencyScore = 80
  if (efficiencyRatio > 1.2) efficiencyScore = 70
  if (efficiencyRatio > 1.5) efficiencyScore = 60
  if (efficiencyRatio < 0.8) efficiencyScore = 75

  const overall = Math.round(
    focusScore * 0.4 + postureScore * 0.3 + efficiencyScore * 0.3
  )

  return {
    focus: focusScore,
    posture: postureScore,
    efficiency: efficiencyScore,
    overall
  }
}

export function buildSessionResult({
  startTime,
  endTime,
  expectedDuration,
  snapshots = [],
  reminders = []
}) {
  const stats = calculateStats({ startTime, endTime, snapshots, reminders })
  stats.expectedDuration = expectedDuration

  const scores = calculateScores({
    ...stats,
    expectedDuration
  })

  const notesSummary = buildDefaultSummary(scores, stats)

  return createHomeworkSession({
    id: String(startTime),
    startTime,
    endTime,
    expectedDuration,
    duration: stats.duration,
    focusDuration: stats.focusDuration,
    distractCount: stats.distractCount,
    reminderCount: stats.reminderCount,
    postureGoodRatio: stats.postureGoodRatio,
    scores,
    notesSummary,
    snapshots
  })
}

function buildDefaultSummary(scores, stats) {
  const parts = []

  if (scores.overall >= 90) {
    parts.push('本次作业表现非常棒，保持了很好的专注和习惯！')
  } else if (scores.overall >= 75) {
    parts.push('整体表现不错，只要再细心一点，会更上一层楼。')
  } else if (scores.overall >= 60) {
    parts.push('已经在慢慢进步啦，再多一点专注和耐心会更好。')
  } else {
    parts.push('这次状态一般，别泄气，我们下次一起调整节奏。')
  }

  if (scores.focus < 75) {
    parts.push('可以尝试关掉会分心的东西，缩短一次学习时间再慢慢延长。')
  }
  if (scores.posture < 75) {
    parts.push('注意坐直身体，眼睛和书本保持合适距离，保护视力和脊柱。')
  }
  if (stats.reminderCount > 3) {
    parts.push('提醒次数有点多，下次试着在提醒前自己先发现问题并调整。')
  }

  return parts.join(' ')
}


