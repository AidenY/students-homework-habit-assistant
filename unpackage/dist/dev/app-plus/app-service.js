if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_0 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$4 = {
    methods: {
      goStart() {
        uni.navigateTo({
          url: "/pages/session/start"
        });
      },
      goHistory() {
        uni.navigateTo({
          url: "/pages/history/list"
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "home-page" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "title-wrap" }, [
          vue.createElementVNode("text", { class: "app-title" }, "作业习惯小助手"),
          vue.createElementVNode("text", { class: "app-subtitle" }, "帮孩子养成专注、健康的写作业习惯")
        ]),
        vue.createElementVNode("image", {
          class: "header-logo",
          src: _imports_0,
          mode: "aspectFit"
        })
      ]),
      vue.createElementVNode("view", { class: "content-area" }, [
        vue.createElementVNode("view", {
          class: "start-button",
          "hover-class": "start-button-hover",
          "hover-stay-time": "80",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goStart && $options.goStart(...args))
        }, [
          vue.createElementVNode("view", { class: "start-icon-wrapper" }, [
            vue.createElementVNode("text", { class: "start-icon" }, "▶")
          ]),
          vue.createElementVNode("text", { class: "start-text" }, "开始写作业")
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-area" }, [
        vue.createElementVNode("view", {
          class: "history-button",
          "hover-class": "history-button-hover",
          "hover-stay-time": "80",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.goHistory && $options.goHistory(...args))
        }, [
          vue.createElementVNode("text", { class: "history-icon" }, "≡"),
          vue.createElementVNode("text", { class: "history-text" }, "历史记录")
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/pages/index/index.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        durationOptions: [30, 45, 60],
        selectedDuration: 30
      };
    },
    methods: {
      selectDuration(option) {
        this.selectedDuration = option;
      },
      startSession() {
        const startTime = Date.now();
        const expectedDuration = this.selectedDuration * 60 * 1e3;
        uni.navigateTo({
          url: "/pages/session/doing?startTime=" + startTime + "&expectedDuration=" + expectedDuration
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page start-page" }, [
      vue.createElementVNode("view", { class: "hero" }, [
        vue.createElementVNode("image", {
          class: "hero-image",
          src: _imports_0,
          mode: "aspectFit"
        }),
        vue.createElementVNode("view", { class: "hero-text" }, [
          vue.createElementVNode("text", { class: "hero-title" }, "准备好一起写作业了吗？"),
          vue.createElementVNode("text", { class: "hero-subtitle" }, "选一个合适的时间，专心完成本次小任务～")
        ])
      ]),
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("view", { class: "card-title" }, "预计专注时长"),
        vue.createElementVNode("view", { class: "duration-options" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.durationOptions, (option) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: option,
                class: vue.normalizeClass(["duration-item", { active: option === $data.selectedDuration }]),
                onClick: ($event) => $options.selectDuration(option)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "duration-value" },
                  vue.toDisplayString(option) + " 分钟",
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "card tips-card" }, [
        vue.createElementVNode("view", { class: "card-title" }, "小贴士"),
        vue.createElementVNode("text", { class: "tips-text" }, "保持坐姿端正，准备好文具，关掉会打扰你的设备，我们一起加油！")
      ]),
      vue.createElementVNode("view", { class: "bottom-area" }, [
        vue.createElementVNode("button", {
          class: "primary-btn",
          type: "primary",
          "hover-class": "primary-btn-hover",
          "hover-stay-time": "80",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.startSession && $options.startSession(...args))
        }, " 开始写作业 ")
      ])
    ]);
  }
  const PagesSessionStart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/pages/session/start.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const STORAGE_KEY = "homework_sessions";
  function safeParse(value) {
    if (!value)
      return [];
    if (Array.isArray(value))
      return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      formatAppLog("warn", "at common/storageService.js:9", "parse storage error", e);
      return [];
    }
  }
  function getAllSessions() {
    try {
      const raw = uni.getStorageSync(STORAGE_KEY);
      return safeParse(raw);
    } catch (e) {
      formatAppLog("warn", "at common/storageService.js:19", "getAllSessions error", e);
      return [];
    }
  }
  function getSessionById(id) {
    const list = getAllSessions();
    return list.find((item) => item.id === id);
  }
  function addSession(session) {
    const list = getAllSessions();
    list.push(session);
    try {
      uni.setStorageSync(STORAGE_KEY, list);
    } catch (e) {
      formatAppLog("warn", "at common/storageService.js:35", "addSession error", e);
    }
  }
  function createHomeworkSession(payload) {
    const now = Date.now();
    return {
      id: payload.id || String(now),
      startTime: payload.startTime || now,
      endTime: payload.endTime || now,
      expectedDuration: payload.expectedDuration || 0,
      duration: payload.duration || 0,
      focusDuration: payload.focusDuration || 0,
      distractCount: payload.distractCount || 0,
      reminderCount: payload.reminderCount || 0,
      postureGoodRatio: typeof payload.postureGoodRatio === "number" ? payload.postureGoodRatio : 0,
      scores: payload.scores || {
        focus: 0,
        posture: 0,
        efficiency: 0,
        overall: 0
      },
      notesSummary: payload.notesSummary || "",
      snapshots: payload.snapshots || []
    };
  }
  function calcDuration(startTime, endTime) {
    if (!startTime || !endTime)
      return 0;
    return Math.max(0, endTime - startTime);
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
  function formatTime(ts) {
    if (!ts)
      return "";
    const date = new Date(ts);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const pad = (n) => n < 10 ? "0" + n : "" + n;
    return `${y}-${pad(m)}-${pad(d)} ${pad(hh)}:${pad(mm)}`;
  }
  function calculateStats({ startTime, endTime, snapshots, reminders }) {
    const duration = calcDuration(startTime, endTime);
    const total = snapshots.length || 1;
    let focusGoodCount = 0;
    let postureGoodCount = 0;
    let distractCount = 0;
    snapshots.forEach((s) => {
      if (s.focusState === "focus") {
        focusGoodCount += 1;
      } else {
        distractCount += 1;
      }
      if (s.postureState === "good") {
        postureGoodCount += 1;
      }
    });
    const focusRatio = focusGoodCount / total;
    const postureGoodRatio = postureGoodCount / total;
    return {
      startTime,
      endTime,
      duration,
      focusDuration: duration * focusRatio,
      distractCount,
      reminderCount: reminders.length,
      postureGoodRatio
    };
  }
  function calculateScores(stats) {
    const ratioToScore = (ratio) => Math.round(60 + Math.max(0, Math.min(1, ratio)) * 40);
    const focusScore = ratioToScore(stats.focusDuration / (stats.duration || 1));
    const postureScore = ratioToScore(stats.postureGoodRatio);
    const planned = stats.expectedDuration || stats.duration || 1;
    const efficiencyRatio = stats.duration / planned;
    let efficiencyScore = 80;
    if (efficiencyRatio > 1.2)
      efficiencyScore = 70;
    if (efficiencyRatio > 1.5)
      efficiencyScore = 60;
    if (efficiencyRatio < 0.8)
      efficiencyScore = 75;
    const overall = Math.round(
      focusScore * 0.4 + postureScore * 0.3 + efficiencyScore * 0.3
    );
    return {
      focus: focusScore,
      posture: postureScore,
      efficiency: efficiencyScore,
      overall
    };
  }
  function buildSessionResult({
    startTime,
    endTime,
    expectedDuration,
    snapshots = [],
    reminders = []
  }) {
    const stats = calculateStats({ startTime, endTime, snapshots, reminders });
    stats.expectedDuration = expectedDuration;
    const scores = calculateScores({
      ...stats,
      expectedDuration
    });
    const notesSummary = buildDefaultSummary(scores, stats);
    return createHomeworkSession({
      id: String(startTime),
      startTime,
      endTime,
      expectedDuration,
      duration: stats.duration,
      focusDuration: stats.focusDuration,
      distractCount: stats.distractCount,
      reminderCount: stats.reminderCount,
      postureGoodRatio: stats.postureGoodRatio,
      scores,
      notesSummary,
      snapshots
    });
  }
  function buildDefaultSummary(scores, stats) {
    const parts = [];
    if (scores.overall >= 90) {
      parts.push("本次作业表现非常棒，保持了很好的专注和习惯！");
    } else if (scores.overall >= 75) {
      parts.push("整体表现不错，只要再细心一点，会更上一层楼。");
    } else if (scores.overall >= 60) {
      parts.push("已经在慢慢进步啦，再多一点专注和耐心会更好。");
    } else {
      parts.push("这次状态一般，别泄气，我们下次一起调整节奏。");
    }
    if (scores.focus < 75) {
      parts.push("可以尝试关掉会分心的东西，缩短一次学习时间再慢慢延长。");
    }
    if (scores.posture < 75) {
      parts.push("注意坐直身体，眼睛和书本保持合适距离，保护视力和脊柱。");
    }
    if (stats.reminderCount > 3) {
      parts.push("提醒次数有点多，下次试着在提醒前自己先发现问题并调整。");
    }
    return parts.join(" ");
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
  function getPhotosBySession(sessionId) {
    return new Promise((resolve, reject) => {
      if (!db) {
        initDatabase().then(() => {
          _doGetPhotos(sessionId).then(resolve).catch(reject);
        }).catch(reject);
        return;
      }
      _doGetPhotos(sessionId).then(resolve).catch(reject);
    });
  }
  function _doGetPhotos(sessionId) {
    return new Promise((resolve, reject) => {
      const safeSessionId = String(sessionId || "").replace(/'/g, "''");
      const sql = `
      SELECT photo_path, timestamp, elapsed_time, elapsed_text
      FROM ${TABLE_NAME}
      WHERE session_id = '${safeSessionId}'
      ORDER BY timestamp ASC
    `;
      formatAppLog("log", "at common/photoStorage.js:403", "查询照片 SQL", sql.substring(0, 150));
      plus.sqlite.selectSql({
        name: DB_NAME,
        sql,
        success: (result) => {
          formatAppLog("log", "at common/photoStorage.js:409", "查询结果", result);
          const photos = result.map((row) => ({
            path: row.photo_path,
            timestamp: row.timestamp,
            elapsedTime: row.elapsed_time,
            elapsedText: row.elapsed_text
          }));
          formatAppLog("log", "at common/photoStorage.js:416", `查询到 ${photos.length} 张照片`, { sessionId, photos: photos.map((p) => p.path.substring(0, 30)) });
          resolve(photos);
        },
        fail: (err) => {
          formatAppLog("error", "at common/photoStorage.js:420", "查询照片失败", err);
          formatAppLog("error", "at common/photoStorage.js:421", "查询参数", { sessionId, sql: sql.substring(0, 200) });
          reject(err);
        }
      });
    });
  }
  function init() {
    return initDatabase();
  }
  const _sfc_main$2 = {
    data() {
      return {
        session: null,
        photos: []
        // 照片列表
      };
    },
    computed: {
      durationText() {
        if (!this.session)
          return "";
        return formatDuration(this.session.duration);
      },
      focusDurationText() {
        if (!this.session)
          return "";
        return formatDuration(this.session.focusDuration);
      },
      summaryTitle() {
        if (!this.session)
          return "";
        const score = this.session.scores.overall;
        if (score >= 90)
          return "表现非常棒，继续保持！";
        if (score >= 75)
          return "整体不错，还有提升空间～";
        if (score >= 60)
          return "已经在进步啦，再多一点专注会更好。";
        return "别灰心，下次注意坐姿和专注度，我们一起进步！";
      }
    },
    async onLoad(query) {
      const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
      if (eventChannel && eventChannel.on) {
        eventChannel.on("sessionFinished", async (payload) => {
          const session = buildSessionResult(payload);
          if (payload.photos && payload.photos.length > 0) {
            session.photos = payload.photos;
            this.photos = payload.photos;
          } else {
            try {
              const photos = await getPhotosBySession(session.id);
              session.photos = photos;
              this.photos = photos;
            } catch (err) {
              formatAppLog("error", "at pages/session/report.vue:154", "从数据库读取照片失败", err);
              this.photos = [];
            }
          }
          addSession(session);
          this.session = session;
        });
      }
      if (query && query.sessionId) {
        formatAppLog("log", "at pages/session/report.vue:165", "从历史记录进入，sessionId:", query.sessionId);
        const existing = getSessionById(query.sessionId);
        if (existing) {
          this.session = existing;
          formatAppLog("log", "at pages/session/report.vue:169", "找到会话记录", existing.id);
          try {
            formatAppLog("log", "at pages/session/report.vue:173", "开始从数据库读取照片，sessionId:", query.sessionId);
            const photos = await getPhotosBySession(query.sessionId);
            formatAppLog("log", "at pages/session/report.vue:175", "从数据库读取到照片", photos.length, "张", photos);
            this.photos = photos;
            if (photos && photos.length > 0) {
              this.session.photos = photos;
            }
          } catch (err) {
            formatAppLog("error", "at pages/session/report.vue:183", "从数据库读取照片失败", err);
            this.photos = existing.photos || [];
            formatAppLog("log", "at pages/session/report.vue:186", "使用 session 中保存的照片", this.photos.length, "张");
          }
        } else {
          formatAppLog("warn", "at pages/session/report.vue:189", "未找到会话记录，sessionId:", query.sessionId);
        }
      }
    },
    methods: {
      goHome() {
        uni.switchTab({
          url: "/pages/index/index",
          fail: () => {
            uni.reLaunch({
              url: "/pages/index/index"
            });
          }
        });
      },
      goHistory() {
        uni.navigateTo({
          url: "/pages/history/list"
        });
      },
      /**
       * 预览照片
       */
      previewPhoto(index) {
        const urls = this.photos.map((photo) => photo.path);
        uni.previewImage({
          current: index,
          urls,
          fail: (err) => {
            formatAppLog("error", "at pages/session/report.vue:218", "预览图片失败", err);
            uni.showToast({
              title: "预览图片失败",
              icon: "none"
            });
          }
        });
      },
      /**
       * 格式化照片时间显示
       */
      formatPhotoTime(elapsedTime) {
        const totalSeconds = Math.floor(elapsedTime / 1e3);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes > 0) {
          return `${minutes}分${seconds}秒`;
        } else {
          return `${seconds}秒`;
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.session ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "page report-page"
    }, [
      vue.createElementVNode("view", { class: "score-card" }, [
        vue.createElementVNode("view", { class: "score-circle" }, [
          vue.createElementVNode(
            "text",
            { class: "score-value" },
            vue.toDisplayString($data.session.scores.overall),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "score-text" }, [
          vue.createElementVNode("text", { class: "score-title" }, "本次作业综合评分"),
          vue.createElementVNode(
            "text",
            { class: "score-subtitle" },
            vue.toDisplayString($options.summaryTitle),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "card sub-score-card" }, [
        vue.createElementVNode("view", { class: "sub-score-item" }, [
          vue.createElementVNode("text", { class: "sub-score-label" }, "专注"),
          vue.createElementVNode(
            "text",
            { class: "sub-score-value" },
            vue.toDisplayString($data.session.scores.focus),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "sub-score-item" }, [
          vue.createElementVNode("text", { class: "sub-score-label" }, "坐姿与习惯"),
          vue.createElementVNode(
            "text",
            { class: "sub-score-value" },
            vue.toDisplayString($data.session.scores.posture),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "sub-score-item" }, [
          vue.createElementVNode("text", { class: "sub-score-label" }, "效率"),
          vue.createElementVNode(
            "text",
            { class: "sub-score-value" },
            vue.toDisplayString($data.session.scores.efficiency),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "card stats-card" }, [
        vue.createElementVNode("view", { class: "stats-row" }, [
          vue.createElementVNode("view", { class: "stats-item" }, [
            vue.createElementVNode("text", { class: "stats-label" }, "总时长"),
            vue.createElementVNode(
              "text",
              { class: "stats-value" },
              vue.toDisplayString($options.durationText),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "stats-item" }, [
            vue.createElementVNode("text", { class: "stats-label" }, "专注时长"),
            vue.createElementVNode(
              "text",
              { class: "stats-value" },
              vue.toDisplayString($options.focusDurationText),
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", { class: "stats-row" }, [
          vue.createElementVNode("view", { class: "stats-item" }, [
            vue.createElementVNode("text", { class: "stats-label" }, "走神次数"),
            vue.createElementVNode(
              "text",
              { class: "stats-value" },
              vue.toDisplayString($data.session.distractCount),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "stats-item" }, [
            vue.createElementVNode("text", { class: "stats-label" }, "提醒次数"),
            vue.createElementVNode(
              "text",
              { class: "stats-value" },
              vue.toDisplayString($data.session.reminderCount),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "card summary-card" }, [
        vue.createElementVNode("text", { class: "summary-title" }, "老师的话"),
        vue.createElementVNode(
          "text",
          { class: "summary-text" },
          vue.toDisplayString($data.session.notesSummary),
          1
          /* TEXT */
        )
      ]),
      $data.photos && $data.photos.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "card photos-card"
      }, [
        vue.createElementVNode("view", { class: "photos-header" }, [
          vue.createElementVNode("text", { class: "photos-title" }, "📷 作业过程照片"),
          vue.createElementVNode(
            "text",
            { class: "photos-count" },
            "共 " + vue.toDisplayString($data.photos.length) + " 张",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("scroll-view", {
          class: "photos-scroll",
          "scroll-x": "true",
          "show-scrollbar": "false"
        }, [
          vue.createElementVNode("view", { class: "photos-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.photos, (photo, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "photo-item",
                  onClick: ($event) => $options.previewPhoto(index)
                }, [
                  vue.createElementVNode("image", {
                    class: "photo-thumb",
                    src: photo.path,
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "photo-badge" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "photo-badge-text" },
                      "第" + vue.toDisplayString(index + 1) + "张",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "photo-time" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "photo-time-text" },
                      vue.toDisplayString($options.formatPhotoTime(photo.elapsedTime)),
                      1
                      /* TEXT */
                    )
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "bottom-area" }, [
        vue.createElementVNode("button", {
          class: "secondary-btn",
          "hover-class": "secondary-btn-hover",
          "hover-stay-time": "80",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goHistory && $options.goHistory(...args))
        }, " 查看历史记录 "),
        vue.createElementVNode("button", {
          class: "primary-btn",
          "hover-class": "primary-btn-hover",
          "hover-stay-time": "80",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.goHome && $options.goHome(...args))
        }, " 返回首页 ")
      ])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const PagesSessionReport = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/pages/session/report.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        sessions: []
      };
    },
    onShow() {
      const all = getAllSessions() || [];
      const enhanced = all.slice().sort((a, b) => b.startTime - a.startTime).map((s) => ({
        ...s,
        dateText: formatTime(s.startTime),
        durationText: formatDuration(s.duration)
      }));
      this.sessions = enhanced;
    },
    methods: {
      buildTag(item) {
        const overall = item.scores.overall;
        if (overall >= 90)
          return "状态极佳";
        if (overall >= 75)
          return "表现不错";
        if (overall >= 60)
          return "还可以提升";
        return "需要多多努力";
      },
      goDetail(item) {
        uni.navigateTo({
          url: "/pages/session/report?sessionId=" + item.id
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page history-page" }, [
      $data.sessions.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "empty"
      }, [
        vue.createElementVNode("text", { class: "empty-title" }, "还没有作业记录"),
        vue.createElementVNode("text", { class: "empty-subtitle" }, "从首页开始一段新的专注时光吧～")
      ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.sessions, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "card session-item",
              "hover-class": "card-hover",
              "hover-stay-time": "80",
              onClick: ($event) => $options.goDetail(item)
            }, [
              vue.createElementVNode("view", { class: "session-main" }, [
                vue.createElementVNode(
                  "text",
                  { class: "session-date" },
                  vue.toDisplayString(item.dateText),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "session-score" },
                  vue.toDisplayString(item.scores.overall) + " 分",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "session-sub" }, [
                vue.createElementVNode(
                  "text",
                  { class: "session-duration" },
                  "时长：" + vue.toDisplayString(item.durationText),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "session-tag" },
                  vue.toDisplayString($options.buildTag(item)),
                  1
                  /* TEXT */
                )
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]))
    ]);
  }
  const PagesHistoryList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/pages/history/list.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/session/start", PagesSessionStart);
  __definePage("pages/session/report", PagesSessionReport);
  __definePage("pages/history/list", PagesHistoryList);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:6", "App Launch");
      init().catch((err) => {
        formatAppLog("error", "at App.vue:11", "照片存储初始化失败", err);
      });
      this.requestStoragePermission();
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:19", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:22", "App Hide");
    },
    methods: {
      /**
       * 申请存储权限
       */
      requestStoragePermission() {
        try {
          const permissions = [
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE"
          ];
          plus.android.requestPermissions(
            permissions,
            (resultObj) => {
              const readGranted = resultObj.granted && resultObj.granted.includes("android.permission.READ_EXTERNAL_STORAGE");
              const writeGranted = resultObj.granted && resultObj.granted.includes("android.permission.WRITE_EXTERNAL_STORAGE");
              if (readGranted && writeGranted) {
                formatAppLog("log", "at App.vue:44", "存储权限已授予");
              } else {
                formatAppLog("warn", "at App.vue:46", "存储权限未完全授予", resultObj);
                if (resultObj.deniedPresent && resultObj.deniedPresent.length > 0) {
                  setTimeout(() => {
                    uni.showModal({
                      title: "需要存储权限",
                      content: "为了保存作业照片，需要授予存储权限。请在设置中手动开启。",
                      showCancel: true,
                      confirmText: "去设置",
                      cancelText: "稍后",
                      success: (res) => {
                        if (res.confirm) {
                          plus.runtime.openURL("app-settings:");
                        }
                      }
                    });
                  }, 1e3);
                }
              }
            },
            (err) => {
              formatAppLog("error", "at App.vue:68", "存储权限请求失败", err);
            }
          );
        } catch (e) {
          formatAppLog("error", "at App.vue:72", "申请存储权限异常", e);
        }
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
