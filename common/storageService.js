const STORAGE_KEY = 'homework_sessions'

function safeParse(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    return JSON.parse(value)
  } catch (e) {
    console.warn('parse storage error', e)
    return []
  }
}

export function getAllSessions() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    return safeParse(raw)
  } catch (e) {
    console.warn('getAllSessions error', e)
    return []
  }
}

export function getSessionById(id) {
  const list = getAllSessions()
  return list.find(item => item.id === id)
}

export function addSession(session) {
  const list = getAllSessions()
  list.push(session)
  try {
    uni.setStorageSync(STORAGE_KEY, list)
  } catch (e) {
    console.warn('addSession error', e)
  }
}

export function updateSession(session) {
  const list = getAllSessions()
  const index = list.findIndex(item => item.id === session.id)
  if (index >= 0) {
    list.splice(index, 1, session)
  } else {
    list.push(session)
  }
  try {
    uni.setStorageSync(STORAGE_KEY, list)
  } catch (e) {
    console.warn('updateSession error', e)
  }
}

// 为后续云端同步预留
export function syncToCloud(session) {
  console.log('syncToCloud mock, not implemented', session && session.id)
}


