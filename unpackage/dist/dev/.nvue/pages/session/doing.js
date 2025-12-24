import { openBlock, createElementBlock, createElementVNode, toDisplayString, normalizeStyle, createCommentVNode, normalizeClass } from "vue";
function formatAppLog(type, filename, ...args) {
  if (uni.__log__) {
    uni.__log__(type, filename, ...args);
  } else {
    console[type].apply(console, [...args, filename]);
  }
}
let timerId = null;
function randomFrom(array) {
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}
function startMockLoop({ intervalMs = 3e3, onResult }) {
  stopMockLoop();
  timerId = setInterval(() => {
    const now = Date.now();
    const postureState = randomFrom(["good", "good", "good", "bend", "lie", "leave"]);
    const focusState = randomFrom(["focus", "focus", "focus", "distract"]);
    const taskState = randomFrom(["writing", "writing", "thinking", "idle"]);
    const snapshot = {
      timestamp: now,
      postureState,
      focusState,
      taskState,
      triggeredReminders: []
    };
    if (typeof onResult === "function") {
      onResult(snapshot);
    }
  }, intervalMs);
}
function stopMockLoop() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}
function formatDuration(ms) {
  if (!ms || ms <= 0)
    return "00:00";
  const totalSeconds = Math.floor(ms / 1e3);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => n < 10 ? "0" + n : "" + n;
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}
const postureTips = [
  "小朋友坐直一点，肩膀放松，我们一起保护脊梁骨～",
  "身体不要太贴近书本，眼睛和书本要保持一尺的距离哦。",
  "记得两只脚平放在地上，像一棵小树一样站得稳。"
];
const focusTips = [
  "刚刚有点走神了，我们一起把注意力拉回来吧～",
  "先把这道题认真完成，再想别的事情也不迟。",
  "再坚持几分钟，你今天就会比昨天更棒！"
];
const efficiencyTips = [
  "如果一道题卡住太久，可以先做后面的，再回来解决它。",
  "先完成简单的题目，给自己一点小小的成就感～"
];
function pickRandom(list) {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}
async function playReminder(type, fixedText) {
  let text = fixedText;
  if (!text) {
    if (type === "posture") {
      text = pickRandom(postureTips);
    } else if (type === "focus") {
      text = pickRandom(focusTips);
    } else {
      text = pickRandom(efficiencyTips);
    }
  }
  try {
    uni.showToast({
      title: text.length > 7 ? text.slice(0, 7) + "..." : text,
      icon: "none",
      duration: 2e3
    });
    if (uni.vibrateShort) {
      uni.vibrateShort({});
    }
  } catch (e) {
    formatAppLog("warn", "at common/voiceReminder.js:30", "playReminder toast error", e);
  }
  return text;
}
const DB_NAME = "homework_photos.db";
const TABLE_NAME = "photos";
let db = null;
function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      if (db) {
        formatAppLog("log", "at common/photoStorage.js:18", "SQLite 数据库已经打开，直接使用");
        createTable().then(resolve).catch(reject);
        return;
      }
      plus.sqlite.openDatabase({
        name: DB_NAME,
        path: "_doc/" + DB_NAME,
        // 存储在应用文档目录
        success: () => {
          formatAppLog("log", "at common/photoStorage.js:29", "SQLite 数据库打开成功");
          db = true;
          createTable().then(resolve).catch(reject);
        },
        fail: (err) => {
          if (err.code === -1402 || err.message && err.message.includes("Already Open")) {
            formatAppLog("log", "at common/photoStorage.js:38", "数据库已打开，尝试关闭后重新打开");
            try {
              plus.sqlite.closeDatabase({
                name: DB_NAME,
                success: () => {
                  formatAppLog("log", "at common/photoStorage.js:44", "已关闭旧数据库连接，重新打开");
                  plus.sqlite.openDatabase({
                    name: DB_NAME,
                    path: "_doc/" + DB_NAME,
                    success: () => {
                      formatAppLog("log", "at common/photoStorage.js:50", "SQLite 数据库重新打开成功");
                      db = true;
                      createTable().then(resolve).catch(reject);
                    },
                    fail: (err2) => {
                      formatAppLog("error", "at common/photoStorage.js:55", "SQLite 数据库重新打开失败", err2);
                      reject(err2);
                    }
                  });
                },
                fail: (closeErr) => {
                  formatAppLog("log", "at common/photoStorage.js:61", "关闭数据库失败，尝试直接打开", closeErr);
                  db = true;
                  createTable().then(resolve).catch((tableErr) => {
                    formatAppLog("log", "at common/photoStorage.js:66", "创建表失败，尝试重新打开数据库", tableErr);
                    plus.sqlite.openDatabase({
                      name: DB_NAME,
                      path: "_doc/" + DB_NAME,
                      success: () => {
                        formatAppLog("log", "at common/photoStorage.js:71", "SQLite 数据库打开成功（关闭失败后的重试）");
                        db = true;
                        createTable().then(resolve).catch(reject);
                      },
                      fail: (err3) => {
                        formatAppLog("error", "at common/photoStorage.js:76", "SQLite 数据库打开失败（重试）", err3);
                        reject(err3);
                      }
                    });
                  });
                }
              });
            } catch (e) {
              formatAppLog("error", "at common/photoStorage.js:84", "处理数据库打开异常", e);
              reject(e);
            }
          } else {
            formatAppLog("error", "at common/photoStorage.js:88", "SQLite 数据库打开失败", err);
            reject(err);
          }
        }
      });
    } catch (e) {
      formatAppLog("error", "at common/photoStorage.js:94", "初始化 SQLite 异常", e);
      reject(e);
    }
  });
}
function createTable() {
  return new Promise((resolve, reject) => {
    const dropSql = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    const createSql = `
      CREATE TABLE ${TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        photo_path TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        elapsed_time INTEGER NOT NULL,
        elapsed_text TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
      )
    `;
    try {
      plus.sqlite.executeSql({
        name: DB_NAME,
        sql: dropSql,
        success: () => {
          formatAppLog("log", "at common/photoStorage.js:133", "旧表已删除（如果存在）");
          plus.sqlite.executeSql({
            name: DB_NAME,
            sql: createSql,
            success: () => {
              formatAppLog("log", "at common/photoStorage.js:139", "照片表创建成功");
              db = true;
              resolve();
            },
            fail: (err) => {
              formatAppLog("error", "at common/photoStorage.js:145", "照片表创建失败", err);
              reject(err);
            }
          });
        },
        fail: (err) => {
          formatAppLog("warn", "at common/photoStorage.js:151", "删除旧表失败（可能表不存在）", err);
          plus.sqlite.executeSql({
            name: DB_NAME,
            sql: createSql,
            success: () => {
              formatAppLog("log", "at common/photoStorage.js:157", "照片表创建成功（删除失败后）");
              db = true;
              resolve();
            },
            fail: (err2) => {
              formatAppLog("error", "at common/photoStorage.js:162", "照片表创建失败", err2);
              reject(err2);
            }
          });
        }
      });
    } catch (e) {
      formatAppLog("error", "at common/photoStorage.js:169", "执行创建表 SQL 异常", e);
      reject(e);
    }
  });
}
function savePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText) {
  return new Promise((resolve, reject) => {
    if (!db) {
      initDatabase().then(() => {
        _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText).then(resolve).catch(reject);
      }).catch((err) => {
        formatAppLog("error", "at common/photoStorage.js:200", "初始化数据库失败，照片信息将仅保存在内存中", err);
        resolve();
      });
      return;
    }
    _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText).then(resolve).catch((err) => {
      formatAppLog("error", "at common/photoStorage.js:210", "保存照片到数据库失败，但照片已在内存中", err);
      resolve();
    });
  });
}
function _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText) {
  return new Promise((resolve, reject) => {
    if (!sessionId || !photoPath || photoPath.trim() === "" || !timestamp || elapsedTime === void 0 || elapsedTime === null) {
      const error = new Error("保存照片失败：必填字段缺失");
      formatAppLog("error", "at common/photoStorage.js:246", "保存照片参数检查失败", {
        sessionId: sessionId || "undefined",
        photoPath: photoPath || "undefined",
        timestamp: timestamp || "undefined",
        elapsedTime,
        elapsedText: elapsedText || "undefined"
      });
      reject(error);
      return;
    }
    const safeElapsedText = elapsedText || "";
    const safeSessionId = String(sessionId || "");
    const safePhotoPath = String(photoPath || "");
    const safeTimestamp = Number(timestamp || 0);
    const safeElapsedTime = Number(elapsedTime || 0);
    const safeElapsedTextFinal = String(safeElapsedText || "");
    if (!safeSessionId || safeSessionId === "undefined" || safeSessionId === "null") {
      const error = new Error("sessionId 无效: " + sessionId);
      formatAppLog("error", "at common/photoStorage.js:275", "sessionId 验证失败", { sessionId, safeSessionId });
      reject(error);
      return;
    }
    if (!safePhotoPath || safePhotoPath === "undefined" || safePhotoPath === "null") {
      const error = new Error("photoPath 无效: " + photoPath);
      formatAppLog("error", "at common/photoStorage.js:282", "photoPath 验证失败", { photoPath, safePhotoPath });
      reject(error);
      return;
    }
    const escapeSqlString = (str) => {
      if (!str)
        return "";
      return String(str).replace(/'/g, "''").replace(/\\/g, "\\\\");
    };
    const directSql = `
      INSERT INTO ${TABLE_NAME} (session_id, photo_path, timestamp, elapsed_time, elapsed_text)
      VALUES ('${escapeSqlString(safeSessionId)}', '${escapeSqlString(safePhotoPath)}', ${safeTimestamp}, ${safeElapsedTime}, '${escapeSqlString(safeElapsedTextFinal)}')
    `;
    formatAppLog("log", "at common/photoStorage.js:300", "准备保存照片到数据库", {
      sessionId: safeSessionId,
      sessionIdLength: safeSessionId ? safeSessionId.length : 0,
      photoPath: safePhotoPath.substring(0, 50) + "...",
      timestamp: safeTimestamp,
      elapsedTime: safeElapsedTime,
      elapsedText: safeElapsedTextFinal,
      sqlPreview: directSql.substring(0, 150) + "..."
    });
    plus.sqlite.executeSql({
      name: DB_NAME,
      sql: directSql,
      success: () => {
        formatAppLog("log", "at common/photoStorage.js:314", "照片保存成功", { sessionId: safeSessionId, timestamp: safeTimestamp });
        resolve();
      },
      fail: (err) => {
        formatAppLog("error", "at common/photoStorage.js:318", "照片保存失败", err);
        formatAppLog("error", "at common/photoStorage.js:319", "保存参数详情", {
          sessionId: safeSessionId,
          sessionIdType: typeof safeSessionId,
          sessionIdValue: safeSessionId,
          sessionIdLength: safeSessionId ? safeSessionId.length : 0,
          photoPath: safePhotoPath.substring(0, 50),
          timestamp: safeTimestamp,
          elapsedTime: safeElapsedTime,
          elapsedText: safeElapsedTextFinal,
          sql: directSql
        });
        reject(err);
      }
    });
  });
}
const _style_0 = { "page": { "": { "flex": 1, "backgroundColor": "#f3f7ff", "paddingLeft": "16rpx", "paddingRight": "16rpx", "paddingTop": "16rpx", "paddingBottom": "140rpx" } }, "top-card": { "": { "backgroundColor": "#ffffff", "borderRadius": "24rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "16rpx" } }, "time-row": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "12rpx" } }, "time-block": { "": { "flex": 1 } }, "time-label": { "": { "fontSize": "24rpx", "color": "#555555" } }, "time-value": { "": { "fontSize": "34rpx", "fontWeight": "600", "color": "#2c405a", "marginTop": "4rpx" } }, "progress-bar": { "": { "height": "14rpx", "borderRadius": "7rpx", "backgroundColor": "#f0f3fa", "overflow": "hidden" } }, "progress-inner": { "": { "height": "14rpx", "borderRadius": "7rpx", "backgroundColor": "#4ba3ff" } }, "camera-card": { "": { "marginTop": "12rpx", "marginBottom": "16rpx", "borderRadius": "24rpx", "backgroundColor": "#ffffff", "overflow": "hidden" } }, "camera-view-wrapper": { "": { "width": "750rpx", "height": "520rpx", "position": "relative", "backgroundColor": "#000000", "overflow": "hidden" } }, "camera-view": { "": { "width": "750rpx", "height": "520rpx", "backgroundColor": "#000000" } }, "camera-placeholder": { "": { "position": "absolute", "top": 0, "left": 0, "width": "750rpx", "height": "520rpx", "backgroundColor": "#1a1a1a", "alignItems": "center", "justifyContent": "center", "flexDirection": "column", "zIndex": 1 } }, "placeholder-text": { "": { "fontSize": "32rpx", "color": "#ffffff", "marginBottom": "12rpx" } }, "placeholder-subtitle": { "": { "fontSize": "24rpx", "color": "#999999" } }, "camera-overlay": { "": { "paddingTop": "16rpx", "paddingRight": "20rpx", "paddingBottom": "18rpx", "paddingLeft": "20rpx" } }, "camera-title": { "": { "fontSize": "30rpx", "fontWeight": "600", "color": "#2c405a", "marginBottom": "6rpx" } }, "camera-subtitle": { "": { "fontSize": "24rpx", "color": "#555555" } }, "switch-row": { "": { "marginTop": "10rpx" } }, "camera-tip": { "": { "fontSize": "22rpx", "color": "#888888", "marginBottom": "6rpx" } }, "switch-btn": { "": { "paddingLeft": "22rpx", "paddingRight": "22rpx", "paddingTop": "8rpx", "paddingBottom": "8rpx", "borderRadius": "32rpx", "backgroundColor": "#e6f1ff" } }, "switch-text": { "": { "fontSize": "24rpx", "color": "#2f80ff" } }, "debug-panel": { "": { "marginTop": "12rpx", "paddingTop": "12rpx", "paddingRight": "12rpx", "paddingBottom": "12rpx", "paddingLeft": "12rpx", "backgroundColor": "#fff3cd", "borderRadius": "8rpx", "borderWidth": "1rpx", "borderColor": "#ffc107" } }, "debug-title": { "": { "fontSize": "26rpx", "fontWeight": "600", "color": "#856404", "marginBottom": "8rpx" } }, "debug-item": { "": { "fontSize": "22rpx", "color": "#856404", "marginBottom": "4rpx", "lines": 3 } }, "debug-error": { "": { "color": "#dc3545" } }, "debug-btn-row": { "": { "flexDirection": "row", "marginTop": "8rpx", "justifyContent": "space-between" } }, "debug-btn": { "": { "flex": 1, "marginRight": "8rpx", "paddingTop": "6rpx", "paddingRight": "12rpx", "paddingBottom": "6rpx", "paddingLeft": "12rpx", "backgroundColor": "#ffc107", "borderRadius": "6rpx", "alignItems": "center", "justifyContent": "center", "marginRight:last-child": 0 } }, "debug-btn-text": { "": { "fontSize": "22rpx", "color": "#856404" } }, "debug-toggle": { "": { "marginTop": "8rpx", "alignItems": "center" } }, "debug-toggle-btn": { "": { "paddingTop": "6rpx", "paddingRight": "16rpx", "paddingBottom": "6rpx", "paddingLeft": "16rpx", "backgroundColor": "#e6f1ff", "borderRadius": "6rpx" } }, "debug-toggle-text": { "": { "fontSize": "22rpx", "color": "#2f80ff" } }, "status-row": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "8rpx" } }, "status-card": { "": { "flex": 1, "marginRight": "8rpx", "borderRadius": "20rpx", "paddingTop": "14rpx", "paddingRight": "16rpx", "paddingBottom": "14rpx", "paddingLeft": "16rpx", "backgroundColor": "#f5f7fb", "marginRight:last-child": 0 } }, "status-label": { "": { "fontSize": "24rpx", "color": "#555555" } }, "status-value": { "": { "fontSize": "28rpx", "fontWeight": "600", "marginTop": "4rpx" }, ".status-good ": { "color": "#2f9b59" }, ".status-focus ": { "color": "#2f9b59" }, ".status-bend ": { "color": "#f0ad4e" }, ".status-distract ": { "color": "#f0ad4e" }, ".status-idle ": { "color": "#f0ad4e" }, ".status-lie ": { "color": "#dd524d" }, ".status-leave ": { "color": "#dd524d" } }, "encourage": { "": { "marginTop": "4rpx", "marginBottom": "8rpx" } }, "encourage-text": { "": { "fontSize": "26rpx", "color": "#2f9b59" } }, "reminder-card": { "": { "borderRadius": "24rpx", "backgroundColor": "#ffffff", "paddingTop": "18rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "8rpx" } }, "reminder-header": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "8rpx" } }, "reminder-title": { "": { "fontSize": "28rpx", "fontWeight": "600", "color": "#2c405a" } }, "reminder-count": { "": { "fontSize": "24rpx", "color": "#555555" } }, "reminder-content": { "": { "flexDirection": "row", "alignItems": "center" } }, "reminder-icon": { "": { "fontSize": "30rpx", "marginRight": "6rpx" } }, "reminder-text": { "": { "fontSize": "26rpx", "color": "#3f536e" } }, "reminder-empty": { "": { "fontSize": "26rpx", "color": "#3f536e" } }, "bottom-area": { "": { "position": "fixed", "left": 0, "right": 0, "bottom": "40rpx", "paddingLeft": "32rpx", "paddingRight": "32rpx" } }, "danger-btn": { "": { "height": "88rpx", "borderRadius": "44rpx", "backgroundColor": "#ff6b6b", "alignItems": "center", "justifyContent": "center" } }, "danger-text": { "": { "fontSize": "32rpx", "color": "#ffffff" } } };
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
  data() {
    return {
      startTime: 0,
      expectedDuration: 0,
      now: Date.now(),
      timer: null,
      snapshots: [],
      reminders: [],
      lastReminderText: "",
      reminderCount: 0,
      postureState: "good",
      focusState: "focus",
      taskState: "writing",
      badStreak: 0,
      devicePosition: "front",
      showDebugInfo: false,
      permissionStatus: "未知",
      cameraStatus: "未知",
      cameraError: "",
      cameraErrorDetail: "",
      pusherReady: false,
      pusherContext: null,
      permissionGranted: false,
      aspect: "9:16",
      // 竖屏比例
      photoTimer: null,
      // 拍照定时器
      photos: []
      // 保存的照片列表
    };
  },
  computed: {
    elapsedText() {
      return formatDuration(this.now - this.startTime);
    },
    expectedText() {
      return formatDuration(this.expectedDuration);
    },
    progressPercent() {
      if (!this.expectedDuration)
        return 0;
      const ratio = (this.now - this.startTime) / this.expectedDuration;
      let p = Math.floor(ratio * 100);
      if (p < 0)
        p = 0;
      if (p > 100)
        p = 100;
      return p;
    },
    postureLabel() {
      const map = {
        good: "坐姿端正",
        bend: "有点趴桌",
        lie: "几乎趴下了",
        leave: "离开座位"
      };
      return map[this.postureState] || "坐姿端正";
    },
    focusLabel() {
      const map = {
        focus: "很专心",
        distract: "有点走神"
      };
      return map[this.focusState] || "很专心";
    },
    taskLabel() {
      const map = {
        writing: "正在书写",
        thinking: "在思考",
        idle: "在发呆"
      };
      return map[this.taskState] || "正在书写";
    },
    encourageText() {
      if (this.postureState === "good" && this.focusState === "focus") {
        return "现在的状态很棒，继续保持哦！";
      }
      return "";
    }
  },
  created() {
    const query = this.$route && this.$route.query ? this.$route.query : {};
    this.startTime = Number(query.startTime) || Date.now();
    this.expectedDuration = Number(query.expectedDuration) || 30 * 60 * 1e3;
    this.sessionId = String(this.startTime);
    formatAppLog("log", "at pages/session/doing.nvue:214", "created: 初始化 sessionId", this.sessionId, "startTime", this.startTime);
  },
  mounted() {
    formatAppLog("log", "at pages/session/doing.nvue:218", "doing page mounted");
    setTimeout(() => {
      this.initLivePusher();
    }, 100);
  },
  onShow() {
    if (!this.startTime || this.startTime === 0) {
      this.startTime = Date.now();
    }
    if (!this.sessionId || this.sessionId === "" || this.sessionId === "0") {
      this.sessionId = String(this.startTime);
      formatAppLog("log", "at pages/session/doing.nvue:232", "onShow: 初始化 sessionId", this.sessionId);
    }
    this.startTimers();
    this.startDetection();
    if (!this.pusherContext) {
      this.initLivePusher();
    }
    this.requestCameraPermission();
  },
  onHide() {
    this.clearTimers();
    stopMockLoop();
    this.stopLivePusher();
  },
  beforeDestroy() {
    this.clearTimers();
    stopMockLoop();
    this.stopLivePusher();
  },
  methods: {
    startTimers() {
      this.now = Date.now();
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1e3);
    },
    clearTimers() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (this.photoTimer) {
        clearInterval(this.photoTimer);
        this.photoTimer = null;
      }
    },
    startDetection() {
      startMockLoop({
        intervalMs: 3e3,
        onResult: (snapshot) => {
          this.snapshots.push(snapshot);
          this.postureState = snapshot.postureState;
          this.focusState = snapshot.focusState;
          this.taskState = snapshot.taskState;
          const isBad = snapshot.postureState !== "good" || snapshot.focusState !== "focus";
          if (isBad) {
            this.badStreak += 1;
          } else {
            this.badStreak = 0;
          }
          if (this.badStreak >= 2) {
            this.triggerReminder(snapshot);
            this.badStreak = 0;
          }
        }
      });
      this.startPhotoCapture();
    },
    /**
     * 启动定时拍照
     */
    startPhotoCapture() {
      this.capturePhoto();
      this.photoTimer = setInterval(() => {
        this.capturePhoto();
      }, 1e3);
    },
    /**
     * 拍照
     */
    capturePhoto() {
      if (!this.pusherContext || !this.pusherReady) {
        formatAppLog("log", "at pages/session/doing.nvue:320", "摄像头未准备好，无法拍照");
        return;
      }
      try {
        this.pusherContext.snapshot({
          quality: "high",
          // 高质量
          success: async (res) => {
            formatAppLog("log", "at pages/session/doing.nvue:331", "snapshot 返回数据", res);
            let photoPath = null;
            if (res.message && res.message.tempImagePath) {
              photoPath = res.message.tempImagePath;
            } else if (res.tempImagePath) {
              photoPath = res.tempImagePath;
            } else if (res.tempFilePath) {
              photoPath = res.tempFilePath;
            } else if (res.path) {
              photoPath = res.path;
            } else if (res.filePath) {
              photoPath = res.filePath;
            }
            if (!photoPath) {
              formatAppLog("error", "at pages/session/doing.nvue:349", "拍照失败：未获取到照片路径", res);
              uni.showToast({
                title: "拍照失败：未获取到照片路径",
                icon: "none",
                duration: 2e3
              });
              return;
            }
            formatAppLog("log", "at pages/session/doing.nvue:358", "获取到照片路径", photoPath);
            const timestamp = Date.now();
            const elapsedTime = timestamp - this.startTime;
            const elapsedText = this.formatElapsedTime(elapsedTime);
            const photoInfo = {
              path: photoPath,
              timestamp,
              elapsedTime,
              elapsedText
            };
            this.photos.push(photoInfo);
            formatAppLog("log", "at pages/session/doing.nvue:373", "拍照成功", photoInfo);
            try {
              if (!this.sessionId || this.sessionId === "" || this.sessionId === "0") {
                this.sessionId = String(this.startTime);
                formatAppLog("warn", "at pages/session/doing.nvue:380", "capturePhoto: sessionId 为空，重新初始化", this.sessionId);
              }
              formatAppLog("log", "at pages/session/doing.nvue:383", "准备保存照片，sessionId:", this.sessionId, "photoPath:", photoPath.substring(0, 50));
              await savePhoto(
                this.sessionId,
                photoPath,
                timestamp,
                elapsedTime,
                elapsedText
              );
              formatAppLog("log", "at pages/session/doing.nvue:392", "照片已保存到数据库");
            } catch (dbErr) {
              formatAppLog("error", "at pages/session/doing.nvue:394", "保存照片到数据库失败", dbErr);
              formatAppLog("error", "at pages/session/doing.nvue:395", "失败时的 sessionId:", this.sessionId, "类型:", typeof this.sessionId);
            }
            uni.showToast({
              title: `已保存照片 (${this.photos.length}张)`,
              icon: "none",
              duration: 1e3
            });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/session/doing.nvue:407", "拍照失败", err);
          }
        });
      } catch (e) {
        formatAppLog("error", "at pages/session/doing.nvue:411", "拍照异常", e);
      }
    },
    /**
     * 格式化已用时间文本
     */
    formatElapsedTime(ms) {
      const totalSeconds = Math.floor(ms / 1e3);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
    async triggerReminder(snapshot) {
      const type = snapshot.postureState !== "good" ? "posture" : "focus";
      const text = await playReminder(type);
      this.lastReminderText = text;
      this.reminderCount += 1;
      this.reminders.push({
        timestamp: Date.now(),
        type,
        text
      });
    },
    async replayLastReminder() {
      if (!this.lastReminderText)
        return;
      await playReminder("repeat", this.lastReminderText);
    },
    switchCamera() {
      this.devicePosition = this.devicePosition === "front" ? "back" : "front";
      this.cameraStatus = `正在切换到${this.devicePosition === "front" ? "前置" : "后置"}摄像头...`;
      if (this.pusherContext) {
        try {
          this.pusherContext.switchCamera({
            success: () => {
              formatAppLog("log", "at pages/session/doing.nvue:453", "摄像头切换成功");
            },
            fail: (err) => {
              formatAppLog("log", "at pages/session/doing.nvue:456", "摄像头切换失败", err);
            }
          });
        } catch (e) {
          formatAppLog("log", "at pages/session/doing.nvue:460", "switchCamera 方法可能不支持，使用 device-position 属性切换");
        }
      }
    },
    endSession() {
      const endTime = Date.now();
      stopMockLoop();
      this.clearTimers();
      const payload = {
        startTime: this.startTime,
        endTime,
        expectedDuration: this.expectedDuration,
        snapshots: this.snapshots,
        reminders: this.reminders,
        photos: this.photos
        // 传递照片列表
      };
      uni.navigateTo({
        url: `/pages/session/report?sessionId=${this.sessionId}`,
        success: (res) => {
          res.eventChannel && res.eventChannel.emit("sessionFinished", payload);
        }
      });
    },
    /**
     * 初始化 live-pusher
     */
    initLivePusher() {
      this.$nextTick(() => {
        try {
          this.pusherContext = uni.createLivePusherContext("livePusher", this);
          formatAppLog("log", "at pages/session/doing.nvue:494", "live-pusher context created", this.pusherContext);
        } catch (e) {
          formatAppLog("error", "at pages/session/doing.nvue:496", "创建 live-pusher context 失败", e);
          setTimeout(() => {
            try {
              this.pusherContext = uni.createLivePusherContext("livePusher", this);
              formatAppLog("log", "at pages/session/doing.nvue:501", "live-pusher context 重试成功", this.pusherContext);
            } catch (e2) {
              formatAppLog("error", "at pages/session/doing.nvue:503", "live-pusher context 重试也失败", e2);
            }
          }, 500);
        }
      });
    },
    /**
     * 启动 live-pusher 预览
     */
    startLivePusher() {
      if (!this.pusherContext) {
        this.initLivePusher();
      }
      if (!this.permissionGranted) {
        formatAppLog("log", "at pages/session/doing.nvue:519", "权限未授予，等待权限授予后再启动");
        return;
      }
      if (!this.pusherContext) {
        formatAppLog("log", "at pages/session/doing.nvue:524", "pusherContext 不存在，重新初始化");
        this.initLivePusher();
        setTimeout(() => {
          this._doStartLivePusher();
        }, 300);
        return;
      }
      this._doStartLivePusher();
    },
    /**
     * 实际执行启动 live-pusher 的方法
     */
    _doStartLivePusher() {
      if (!this.pusherContext) {
        formatAppLog("error", "at pages/session/doing.nvue:541", "pusherContext 仍然不存在");
        return;
      }
      if (typeof this.pusherContext.startPreview === "function") {
        this.pusherContext.startPreview({
          success: () => {
            this.pusherReady = true;
            this.cameraStatus = "摄像头预览已启动 ✓";
            formatAppLog("log", "at pages/session/doing.nvue:551", "live-pusher 预览启动成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/session/doing.nvue:554", "live-pusher startPreview 失败", err);
            this._tryStartMethod();
          }
        });
      } else {
        this._tryStartMethod();
      }
    },
    /**
     * 尝试使用 start 方法
     */
    _tryStartMethod() {
      if (!this.pusherContext)
        return;
      this.pusherContext.start({
        success: () => {
          this.pusherReady = true;
          this.cameraStatus = "摄像头预览已启动 ✓";
          formatAppLog("log", "at pages/session/doing.nvue:575", "live-pusher start 方法成功");
        },
        fail: (err) => {
          this.cameraStatus = "启动失败: " + JSON.stringify(err);
          this.cameraError = JSON.stringify(err);
          formatAppLog("error", "at pages/session/doing.nvue:580", "live-pusher start 方法失败", err);
          const errorMsg = err.errMsg || err.message || JSON.stringify(err);
          formatAppLog("error", "at pages/session/doing.nvue:584", "详细错误信息:", errorMsg);
          if (!this.showDebugInfo) {
            this.showDebugInfo = true;
          }
          uni.showToast({
            title: "摄像头启动失败，请查看调试信息",
            icon: "none",
            duration: 3e3
          });
        }
      });
    },
    /**
     * 停止 live-pusher 预览
     */
    stopLivePusher() {
      if (this.pusherContext) {
        this.pusherContext.stopPreview({
          success: () => {
            this.pusherReady = false;
            formatAppLog("log", "at pages/session/doing.nvue:608", "live-pusher 预览已停止");
          },
          fail: () => {
            this.pusherContext.stop({
              success: () => {
                this.pusherReady = false;
                formatAppLog("log", "at pages/session/doing.nvue:615", "live-pusher 已停止");
              },
              fail: (err) => {
                formatAppLog("log", "at pages/session/doing.nvue:618", "live-pusher 停止失败", err);
              }
            });
          }
        });
      }
    },
    /**
     * 请求摄像头权限
     */
    requestCameraPermission() {
      try {
        this.permissionStatus = "请求中...";
        plus.android.requestPermissions(
          ["android.permission.CAMERA"],
          (resultObj) => {
            const granted = resultObj.granted && resultObj.granted.length > 0;
            if (granted) {
              this.permissionStatus = "已授予";
              this.permissionGranted = true;
              formatAppLog("log", "at pages/session/doing.nvue:642", "摄像头权限已授予", resultObj);
              setTimeout(() => {
                this.startLivePusher();
              }, 300);
            } else {
              this.permissionStatus = "被拒绝";
              this.permissionGranted = false;
              formatAppLog("log", "at pages/session/doing.nvue:651", "摄像头权限被拒绝", resultObj);
            }
          },
          (err) => {
            this.permissionStatus = "请求失败: " + JSON.stringify(err);
            this.permissionGranted = false;
            formatAppLog("log", "at pages/session/doing.nvue:657", "摄像头权限请求失败: " + JSON.stringify(err));
            uni.showToast({
              title: "未授予摄像头权限，无法预览画面",
              icon: "none",
              duration: 3e3
            });
          }
        );
      } catch (e) {
        this.permissionStatus = "异常: " + e.toString();
        this.permissionGranted = false;
        formatAppLog("log", "at pages/session/doing.nvue:668", "摄像头权限请求异常: " + e);
      }
    },
    /**
     * live-pusher 状态变化事件
     */
    onPusherStateChange(e) {
      formatAppLog("log", "at pages/session/doing.nvue:685", "live-pusher state change", e);
      const code = e.detail.code;
      switch (code) {
        case 1001:
          this.cameraStatus = "已连接推流服务器";
          break;
        case 1002:
          this.pusherReady = true;
          this.cameraStatus = "摄像头预览已启动 ✓";
          break;
        case 1003:
          this.pusherReady = true;
          this.cameraStatus = "摄像头画面已显示 ✓";
          break;
        case 1004:
          this.pusherReady = true;
          this.cameraStatus = "摄像头画面已显示 ✓";
          break;
        case 1005:
          break;
        case 1006:
          this.cameraStatus = "视频播放结束";
          break;
        case 1007:
          this.cameraStatus = "视频加载中...";
          break;
        case 1008:
          this.cameraStatus = "解码器启动";
          break;
        case -1301:
          this.cameraError = "打开摄像头失败";
          this.cameraStatus = "打开摄像头失败";
          if (!this.showDebugInfo) {
            this.showDebugInfo = true;
          }
          break;
        case -1302:
          this.cameraError = "打开麦克风失败";
          break;
        case -1303:
          this.cameraError = "视频编码失败";
          break;
        case -1304:
          this.cameraError = "音频编码失败";
          break;
        case -1305:
          this.cameraError = "不支持的视频分辨率";
          break;
        case -1306:
          this.cameraError = "不支持的音频采样率";
          break;
        case -1307:
          this.cameraError = "网络断连";
          this.cameraStatus = "网络断连";
          break;
        case -1308:
          this.cameraError = "开始录屏失败";
          break;
        case -1309:
          this.cameraError = "录屏失败";
          break;
        default:
          formatAppLog("log", "at pages/session/doing.nvue:749", "未知状态码:", code);
      }
    },
    /**
     * live-pusher 网络状态事件
     */
    onPusherNetStatus(e) {
    },
    /**
     * live-pusher 错误事件
     */
    onPusherError(e) {
      formatAppLog("error", "at pages/session/doing.nvue:765", "live-pusher error", e);
      this.cameraError = "live-pusher 错误: " + JSON.stringify(e.detail);
      this.cameraStatus = "摄像头错误";
      if (!this.showDebugInfo) {
        this.showDebugInfo = true;
      }
      uni.showToast({
        title: "摄像头错误，请查看调试信息",
        icon: "none",
        duration: 3e3
      });
    },
    toggleDebugInfo() {
      this.showDebugInfo = !this.showDebugInfo;
    },
    /**
     * 检查摄像头状态
     */
    checkCameraStatus() {
      try {
        const main = plus.android.runtimeMainActivity();
        const pm = plus.android.invoke(main, "getPackageManager");
        const hasCamera = plus.android.invoke(pm, "hasSystemFeature", "android.hardware.camera");
        const Camera = plus.android.importClass("android.hardware.Camera");
        const cameraCount = Camera.getNumberOfCameras();
        const PackageManager = plus.android.importClass("android.content.pm.PackageManager");
        const permission = "android.permission.CAMERA";
        const result = plus.android.invoke(main, "checkSelfPermission", permission);
        const granted = result === PackageManager.PERMISSION_GRANTED;
        this.permissionStatus = `权限检查: ${granted ? "已授予" : "未授予"}`;
        if (this.pusherReady) {
          this.cameraStatus = `live-pusher 已启动 (设备支持: ${hasCamera ? "是" : "否"}, 数量: ${cameraCount})`;
        } else {
          this.cameraStatus = `等待 live-pusher 启动... (设备支持: ${hasCamera ? "是" : "否"}, 数量: ${cameraCount}, 权限: ${granted ? "已授予" : "未授予"})`;
        }
      } catch (e) {
        this.cameraStatus = "检查失败: " + e.toString();
        formatAppLog("log", "at pages/session/doing.nvue:813", "检查摄像头状态失败", e);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", { class: "page doing-page" }, [
      createElementVNode("view", { class: "top-card" }, [
        createElementVNode("view", { class: "time-row" }, [
          createElementVNode("view", { class: "time-block" }, [
            createElementVNode("u-text", { class: "time-label" }, "已用时间"),
            createElementVNode(
              "u-text",
              { class: "time-value" },
              toDisplayString($options.elapsedText),
              1
              /* TEXT */
            )
          ]),
          createElementVNode("view", { class: "time-block" }, [
            createElementVNode("u-text", { class: "time-label" }, "预计"),
            createElementVNode(
              "u-text",
              { class: "time-value" },
              toDisplayString($options.expectedText),
              1
              /* TEXT */
            )
          ])
        ]),
        createElementVNode("view", { class: "progress-bar" }, [
          createElementVNode(
            "view",
            {
              class: "progress-inner",
              style: normalizeStyle({ width: $options.progressPercent + "%" })
            },
            null,
            4
            /* STYLE */
          )
        ])
      ]),
      createElementVNode("view", { class: "camera-card" }, [
        createElementVNode("view", { class: "camera-view-wrapper" }, [
          createElementVNode("live-pusher", {
            id: "livePusher",
            class: "camera-view",
            url: "",
            mode: "SD",
            autopush: false,
            enableCamera: true,
            devicePosition: $data.devicePosition,
            beauty: 0,
            whiteness: 0,
            aspect: $data.aspect,
            minBitrate: 200,
            maxBitrate: 1e3,
            waiting: false,
            enableMic: false,
            muted: true,
            onStatechange: _cache[0] || (_cache[0] = (...args) => $options.onPusherStateChange && $options.onPusherStateChange(...args)),
            onNetstatus: _cache[1] || (_cache[1] = (...args) => $options.onPusherNetStatus && $options.onPusherNetStatus(...args)),
            onError: _cache[2] || (_cache[2] = (...args) => $options.onPusherError && $options.onPusherError(...args))
          }, null, 40, ["devicePosition", "aspect"]),
          !$data.pusherReady ? (openBlock(), createElementBlock("view", {
            key: 0,
            class: "camera-placeholder"
          }, [
            createElementVNode("u-text", { class: "placeholder-text" }, "摄像头预览区域"),
            createElementVNode(
              "u-text",
              { class: "placeholder-subtitle" },
              toDisplayString($data.permissionGranted ? "正在启动摄像头..." : "权限授予后将显示实时画面"),
              1
              /* TEXT */
            )
          ])) : createCommentVNode("v-if", true)
        ]),
        createElementVNode("view", { class: "camera-overlay" }, [
          createElementVNode("u-text", { class: "camera-title" }, "实时摄像头预览"),
          createElementVNode(
            "u-text",
            { class: "camera-subtitle" },
            " 当前使用：" + toDisplayString($data.devicePosition === "front" ? "前置摄像头" : "后置摄像头"),
            1
            /* TEXT */
          ),
          createElementVNode("view", { class: "switch-row" }, [
            createElementVNode("u-text", { class: "camera-tip" }, "保持脸部出现在画面中间，更容易识别姿态～"),
            createElementVNode("view", {
              class: "switch-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.switchCamera && $options.switchCamera(...args))
            }, [
              createElementVNode(
                "u-text",
                { class: "switch-text" },
                " 切换为" + toDisplayString($data.devicePosition === "front" ? "后置" : "前置") + "摄像头 ",
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        $data.showDebugInfo ? (openBlock(), createElementBlock("view", {
          key: 0,
          class: "debug-panel"
        }, [
          createElementVNode("u-text", { class: "debug-title" }, "调试信息"),
          createElementVNode(
            "u-text",
            { class: "debug-item" },
            "权限状态: " + toDisplayString($data.permissionStatus),
            1
            /* TEXT */
          ),
          createElementVNode(
            "u-text",
            { class: "debug-item" },
            "摄像头状态: " + toDisplayString($data.cameraStatus),
            1
            /* TEXT */
          ),
          $data.cameraError ? (openBlock(), createElementBlock(
            "u-text",
            {
              key: 0,
              class: "debug-item debug-error"
            },
            "错误信息: " + toDisplayString($data.cameraError),
            1
            /* TEXT */
          )) : createCommentVNode("v-if", true),
          $data.cameraErrorDetail ? (openBlock(), createElementBlock(
            "u-text",
            {
              key: 1,
              class: "debug-item debug-error"
            },
            "错误详情: " + toDisplayString($data.cameraErrorDetail),
            1
            /* TEXT */
          )) : createCommentVNode("v-if", true),
          createElementVNode("view", { class: "debug-btn-row" }, [
            createElementVNode("view", {
              class: "debug-btn",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.toggleDebugInfo && $options.toggleDebugInfo(...args))
            }, [
              createElementVNode("u-text", { class: "debug-btn-text" }, "隐藏调试")
            ]),
            createElementVNode("view", {
              class: "debug-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.checkCameraStatus && $options.checkCameraStatus(...args))
            }, [
              createElementVNode("u-text", { class: "debug-btn-text" }, "检查状态")
            ])
          ])
        ])) : (openBlock(), createElementBlock("view", {
          key: 1,
          class: "debug-toggle"
        }, [
          createElementVNode("view", {
            class: "debug-toggle-btn",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.toggleDebugInfo && $options.toggleDebugInfo(...args))
          }, [
            createElementVNode("u-text", { class: "debug-toggle-text" }, "显示调试信息")
          ])
        ]))
      ]),
      createElementVNode("view", { class: "status-row" }, [
        createElementVNode(
          "view",
          {
            class: normalizeClass(["status-card", "status-" + $data.postureState])
          },
          [
            createElementVNode("u-text", { class: "status-label" }, "坐姿"),
            createElementVNode(
              "u-text",
              { class: "status-value" },
              toDisplayString($options.postureLabel),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        ),
        createElementVNode(
          "view",
          {
            class: normalizeClass(["status-card", "status-" + $data.focusState])
          },
          [
            createElementVNode("u-text", { class: "status-label" }, "专注"),
            createElementVNode(
              "u-text",
              { class: "status-value" },
              toDisplayString($options.focusLabel),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        ),
        createElementVNode(
          "view",
          {
            class: normalizeClass(["status-card", "status-" + $data.taskState])
          },
          [
            createElementVNode("u-text", { class: "status-label" }, "状态"),
            createElementVNode(
              "u-text",
              { class: "status-value" },
              toDisplayString($options.taskLabel),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ]),
      $options.encourageText ? (openBlock(), createElementBlock("view", {
        key: 0,
        class: "encourage"
      }, [
        createElementVNode(
          "u-text",
          { class: "encourage-text" },
          toDisplayString($options.encourageText),
          1
          /* TEXT */
        )
      ])) : createCommentVNode("v-if", true),
      createElementVNode("view", { class: "reminder-card" }, [
        createElementVNode("view", { class: "reminder-header" }, [
          createElementVNode("u-text", { class: "reminder-title" }, "最近提醒"),
          createElementVNode(
            "u-text",
            { class: "reminder-count" },
            "共 " + toDisplayString($data.reminderCount) + " 次",
            1
            /* TEXT */
          )
        ]),
        $data.lastReminderText ? (openBlock(), createElementBlock("view", {
          key: 0,
          class: "reminder-content",
          onClick: _cache[7] || (_cache[7] = (...args) => $options.replayLastReminder && $options.replayLastReminder(...args))
        }, [
          createElementVNode("u-text", { class: "reminder-icon" }, "🔔"),
          createElementVNode(
            "u-text",
            { class: "reminder-text" },
            toDisplayString($data.lastReminderText),
            1
            /* TEXT */
          )
        ])) : (openBlock(), createElementBlock("view", {
          key: 1,
          class: "reminder-empty"
        }, [
          createElementVNode("u-text", { class: "reminder-text" }, "当前表现不错，继续保持～")
        ]))
      ]),
      createElementVNode("view", { class: "bottom-area" }, [
        createElementVNode("view", {
          class: "danger-btn",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.endSession && $options.endSession(...args))
        }, [
          createElementVNode("u-text", { class: "danger-text" }, "结束作业")
        ])
      ])
    ])
  ]);
}
const doing = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/pages/session/doing.nvue"]]);
export {
  doing as default
};
