let timerId = null

function randomFrom(array) {
  const idx = Math.floor(Math.random() * array.length)
  return array[idx]
}

export function startMockLoop({ intervalMs = 3000, onResult }) {
  stopMockLoop()

  timerId = setInterval(() => {
    const now = Date.now()
    const postureState = randomFrom(['good', 'good', 'good', 'bend', 'lie', 'leave'])
    const focusState = randomFrom(['focus', 'focus', 'focus', 'distract'])
    const taskState = randomFrom(['writing', 'writing', 'thinking', 'idle'])

    const snapshot = {
      timestamp: now,
      postureState,
      focusState,
      taskState,
      triggeredReminders: []
    }

    if (typeof onResult === 'function') {
      onResult(snapshot)
    }
  }, intervalMs)
}

export function stopMockLoop() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}


