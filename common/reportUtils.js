export function buildSummaryText(scores, stats) {
  const parts = []

  if (scores.overall >= 90) {
    parts.push('综合表现非常优秀，已经形成了很好的学习习惯。')
  } else if (scores.overall >= 75) {
    parts.push('整体表现不错，再多一些专注和耐心会更好。')
  } else if (scores.overall >= 60) {
    parts.push('已经在慢慢进步，可以从坐姿和专注力两方面一起调整。')
  } else {
    parts.push('这次状态一般，建议缩短单次学习时间，分段完成任务。')
  }

  if (scores.focus < 75) {
    parts.push('做题时尽量减少东张西望，先把当前题目完成。')
  }
  if (scores.posture < 75) {
    parts.push('记得坐直身体、眼睛离书本一尺远，保护视力和脊柱。')
  }
  if (stats.reminderCount > 3) {
    parts.push('提醒次数偏多，下次试着在提醒前自己先发现问题并调整。')
  }

  return parts.join(' ')
}


