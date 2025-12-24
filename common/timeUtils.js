export function calcDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0
  return Math.max(0, endTime - startTime)
}

export function formatDuration(ms) {
  if (!ms || ms <= 0) return '00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = n => (n < 10 ? '0' + n : '' + n)

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

export function formatTime(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const hh = date.getHours()
  const mm = date.getMinutes()

  const pad = n => (n < 10 ? '0' + n : '' + n)
  return `${y}-${pad(m)}-${pad(d)} ${pad(hh)}:${pad(mm)}`
}


