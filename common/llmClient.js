// 预留给未来云端大模型的统一接口，目前使用本地 Mock。

const useCloudModel = false

export async function analyzeFrame(imageBase64, context) {
  if (!useCloudModel) {
    // 本地 Mock：返回一个与 DetectionSnapshot 相近的结构
    const now = Date.now()
    const randomFrom = list => list[Math.floor(Math.random() * list.length)]

    return {
      timestamp: now,
      postureState: randomFrom(['good', 'good', 'bend', 'lie', 'leave']),
      focusState: randomFrom(['focus', 'focus', 'distract']),
      taskState: randomFrom(['writing', 'writing', 'thinking', 'idle']),
      triggeredReminders: [],
      _mock: true,
      _context: context || null
    }
  }

  // 未来可在这里调用真实云端模型服务
  throw new Error('Cloud model is not configured yet')
}


