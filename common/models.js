// HomeworkSession 和 DetectionSnapshot 相关模型结构说明
// 仅通过注释约定字段，方便后续接入真实类型系统或后端接口。

/**
 * @typedef {Object} DetectionSnapshot
 * @property {number} timestamp - 时间戳，毫秒
 * @property {'good'|'bend'|'lie'|'leave'} postureState - 坐姿状态
 * @property {'focus'|'distract'} focusState - 专注状态
 * @property {'writing'|'thinking'|'idle'} taskState - 作业状态
 * @property {Array<{type:string,text:string}>} triggeredReminders - 本次检测关联的提醒
 */

/**
 * @typedef {Object} HomeworkSession
 * @property {string} id - 会话唯一标识
 * @property {number} startTime - 开始时间戳（毫秒）
 * @property {number} endTime - 结束时间戳（毫秒）
 * @property {number} expectedDuration - 预计时长（毫秒）
 * @property {number} duration - 实际总时长（毫秒）
 * @property {number} focusDuration - 专注时长（毫秒）
 * @property {number} distractCount - 走神次数
 * @property {number} reminderCount - 提醒次数
 * @property {number} postureGoodRatio - 坐姿良好占比（0-1）
 * @property {{focus:number,posture:number,efficiency:number,overall:number}} scores - 各项评分
 * @property {string} notesSummary - 文本总结
 * @property {DetectionSnapshot[]} snapshots - 检测快照列表
 */

/**
 * 创建一个空白的 HomeworkSession（占位用）
 * @param {Partial<HomeworkSession>} payload
 * @returns {HomeworkSession}
 */
export function createHomeworkSession(payload) {
  const now = Date.now()
  return {
    id: payload.id || String(now),
    startTime: payload.startTime || now,
    endTime: payload.endTime || now,
    expectedDuration: payload.expectedDuration || 0,
    duration: payload.duration || 0,
    focusDuration: payload.focusDuration || 0,
    distractCount: payload.distractCount || 0,
    reminderCount: payload.reminderCount || 0,
    postureGoodRatio:
      typeof payload.postureGoodRatio === 'number'
        ? payload.postureGoodRatio
        : 0,
    scores: payload.scores || {
      focus: 0,
      posture: 0,
      efficiency: 0,
      overall: 0
    },
    notesSummary: payload.notesSummary || '',
    snapshots: payload.snapshots || []
  }
}


