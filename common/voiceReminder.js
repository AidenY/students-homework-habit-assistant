import {
  postureTips,
  focusTips,
  efficiencyTips,
  textToAudioMap,
  defaultAudioFiles
} from '@/common/reminderPhrases.js'

function pickRandom(list) {
  const idx = Math.floor(Math.random() * list.length)
  return list[idx]
}

/**
 * 播放语音提醒
 * @param {string} type - 提醒类型：'posture', 'focus', 'efficiency'
 * @param {string} [fixedText] - 固定文本（可选）
 * @returns {Promise<string>} 返回播放的文本内容
 */
export async function playReminder(type, fixedText) {
  let text = fixedText
  let audioPath = null

  if (!text) {
    // 根据类型随机选择文本
    if (type === 'posture') {
      text = pickRandom(postureTips)
    } else if (type === 'focus') {
      text = pickRandom(focusTips)
    } else if (type === 'efficiency') {
      text = pickRandom(efficiencyTips)
    } else {
      text = pickRandom(efficiencyTips)
    }
  }

  // 1. 首先尝试精确匹配文本对应的音频
  audioPath = textToAudioMap[text]

  // 2. 如果没有精确匹配，使用类型对应的默认音频
  if (!audioPath && type) {
    audioPath = defaultAudioFiles[type]
  }

  // 尝试播放音频
  if (audioPath) {
    const audioPlayed = await playAudio(audioPath)

    if (!audioPlayed) {
      // 音频播放失败时使用文本提示
      showToast(text)
    }
  } else {
    // 没有对应音频时使用文本提示
    showToast(text)
  }

  // 振动反馈
  vibrate()

  return text
}

/**
 * 显示提示信息
 * @param {string} text - 提示文本
 */
function showToast(text) {
  try {
    uni.showToast({
      title: text.length > 7 ? text.slice(0, 7) + '...' : text,
      icon: 'none',
      duration: 2000
    })
  } catch (e) {
    console.warn('showToast error', e)
  }
}

/**
 * 振动反馈
 */
function vibrate() {
  if (uni.vibrateShort) {
    try {
      uni.vibrateShort({})
    } catch (e) {
      console.warn('vibrateShort error', e)
    }
  }
}

/**
 * 播放音频文件
 * @param {string} audioPath - 音频文件路径
 * @returns {Promise<boolean>} 是否成功播放
 */
async function playAudio(audioPath) {
  if (!audioPath) {
    console.warn('音频路径为空')
    return false
  }

  // 处理音频路径，确保在不同平台上都能正确访问
  let processedPath = audioPath
  
  // 在 App 端，需要使用绝对路径
  // #ifdef APP-PLUS
  if (audioPath.startsWith('/assets/')) {
    processedPath = audioPath.replace('/assets/', '/static/')
  }
  // #endif
  
  // 在 H5 端，确保路径正确
  // #ifdef H5
  if (audioPath.startsWith('/assets/')) {
    processedPath = audioPath.replace('/assets/', '/static/')
  }
  // #endif

  console.log('原始音频路径:', audioPath)
  console.log('处理后音频路径:', processedPath)

  try {
    // 使用 uni.createInnerAudioContext 创建音频上下文
    const audioContext = uni.createInnerAudioContext()
    
    // 设置音频属性
    audioContext.src = processedPath
    audioContext.autoplay = false
    audioContext.loop = false
    audioContext.volume = 1.0

    return new Promise((resolve) => {
      let resolved = false
      let playStarted = false

      const cleanup = () => {
        if (!resolved) {
          resolved = true
          try {
            audioContext.destroy()
          } catch (e) {
            console.warn('销毁音频上下文失败:', e)
          }
        }
      }

      audioContext.onCanplay(() => {
        console.log('音频可以播放:', processedPath)
        if (!playStarted) {
          playStarted = true
          try {
            audioContext.play()
          } catch (playError) {
            console.error('在canplay中调用play()失败:', playError)
            cleanup()
            resolve(false)
          }
        }
      })

      audioContext.onPlay(() => {
        console.log('音频开始播放:', processedPath)
        if (!resolved) {
          resolved = true
          resolve(true)
        }
      })

      audioContext.onError((error) => {
        console.error('音频播放失败:', processedPath, error)
        cleanup()
        resolve(false)
      })

      audioContext.onEnded(() => {
        console.log('音频播放结束:', processedPath)
        cleanup()
      })

      audioContext.onStop(() => {
        console.log('音频播放停止:', processedPath)
        if (!resolved) {
          // 如果还没有resolved，说明可能是立即停止，这通常表示播放失败
          console.warn('音频立即停止，可能播放失败')
          cleanup()
          resolve(false)
        } else {
          cleanup()
        }
      })

      // 设置超时，防止卡住
      setTimeout(() => {
        if (!resolved) {
          console.warn('音频播放超时:', processedPath)
          cleanup()
          resolve(false)
        }
      }, 8000)

      // 尝试直接播放（某些平台可能不需要等待canplay）
      setTimeout(() => {
        if (!playStarted && !resolved) {
          playStarted = true
          try {
            console.log('尝试直接播放音频:', processedPath)
            audioContext.play()
          } catch (playError) {
            console.error('直接调用play()失败:', playError)
            cleanup()
            resolve(false)
          }
        }
      }, 100)
    })
  } catch (error) {
    console.error('创建音频上下文失败:', error)
    return false
  }
}

/**
 * 重新播放最后一次提醒
 * @param {string} lastText - 最后一次提醒的文本
 * @returns {Promise<string>} 返回播放的文本内容
 */
export async function replayLastReminder(lastText) {
  if (!lastText) {
    return ''
  }

  return await playReminder(null, lastText)
}


