import { postureTips, focusTips, efficiencyTips } from '@/common/reminderPhrases.js'

function pickRandom(list) {
  const idx = Math.floor(Math.random() * list.length)
  return list[idx]
}

export async function playReminder(type, fixedText) {
  let text = fixedText
  if (!text) {
    if (type === 'posture') {
      text = pickRandom(postureTips)
    } else if (type === 'focus') {
      text = pickRandom(focusTips)
    } else {
      text = pickRandom(efficiencyTips)
    }
  }

  try {
    uni.showToast({
      title: text.length > 7 ? text.slice(0, 7) + '...' : text,
      icon: 'none',
      duration: 2000
    })
    if (uni.vibrateShort) {
      uni.vibrateShort({})
    }
  } catch (e) {
    console.warn('playReminder toast error', e)
  }

  return text
}


