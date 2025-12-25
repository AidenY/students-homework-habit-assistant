export const postureTips = [
  {
    text: '小朋友坐直一点，肩膀放松，我们一起保护脊梁骨～',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  },
  {
    text: '身体不要太贴近书本，眼睛和书本要保持一尺的距离哦。',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  },
  {
    text: '记得两只脚平放在地上，像一棵小树一样站得稳。',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  }
]

export const focusTips = [
  {
    text: '刚刚有点走神了，我们一起把注意力拉回来吧～',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  },
  {
    text: '先把这道题认真完成，再想别的事情也不迟。',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  },
  {
    text: '再坚持几分钟，你今天就会比昨天更棒！',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  }
]

export const efficiencyTips = [
  {
    text: '如果一道题卡住太久，可以先做后面的，再回来解决它。',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  },
  {
    text: '先完成简单的题目，给自己一点小小的成就感～',
    audio: '/static/ztjun-mstts-1766625175369.wav'
  }
]

// 提取文本内容（向后兼容）
export const postureTexts = postureTips.map(tip => tip.text)
export const focusTexts = focusTips.map(tip => tip.text)
export const efficiencyTexts = efficiencyTips.map(tip => tip.text)

// 所有提示语的文本内容列表
export const allReminderTexts = [
  ...postureTexts,
  ...focusTexts,
  ...efficiencyTexts
]

// 提醒类型映射
export const reminderTypes = {
  posture: {
    tips: postureTips,
    texts: postureTexts,
    name: '坐姿提醒'
  },
  focus: {
    tips: focusTips,
    texts: focusTexts,
    name: '专注提醒'
  },
  efficiency: {
    tips: efficiencyTips,
    texts: efficiencyTexts,
    name: '效率提醒'
  }
}

// 文本到音频的映射
export const textToAudioMap = {}
postureTips.forEach(tip => {
  textToAudioMap[tip.text] = tip.audio
})
focusTips.forEach(tip => {
  textToAudioMap[tip.text] = tip.audio
})
efficiencyTips.forEach(tip => {
  textToAudioMap[tip.text] = tip.audio
})

// 默认音频文件
export const defaultAudioFiles = {
  posture: '/static/ztjun-mstts-1766625175369.wav',
  focus: '/static/ztjun-mstts-1766625175369.wav',
  efficiency: '/static/ztjun-mstts-1766625175369.wav'
}