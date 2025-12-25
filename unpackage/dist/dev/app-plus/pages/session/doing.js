"use weex:vue";

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor
    return this.then(
      value => promise.resolve(callback()).then(() => value),
      reason => promise.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
};

if (typeof uni !== 'undefined' && uni && uni.requireGlobal) {
  const global = uni.requireGlobal()
  ArrayBuffer = global.ArrayBuffer
  Int8Array = global.Int8Array
  Uint8Array = global.Uint8Array
  Uint8ClampedArray = global.Uint8ClampedArray
  Int16Array = global.Int16Array
  Uint16Array = global.Uint16Array
  Int32Array = global.Int32Array
  Uint32Array = global.Uint32Array
  Float32Array = global.Float32Array
  Float64Array = global.Float64Array
  BigInt64Array = global.BigInt64Array
  BigUint64Array = global.BigUint64Array
};


(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // ../../../../../../Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/unpackage/dist/dev/.nvue/pages/session/doing.js
  var import_vue = __toESM(require_vue());
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var timerId = null;
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
  var postureTips = [
    {
      text: "\u5C0F\u670B\u53CB\u5750\u76F4\u4E00\u70B9\uFF0C\u80A9\u8180\u653E\u677E\uFF0C\u6211\u4EEC\u4E00\u8D77\u4FDD\u62A4\u810A\u6881\u9AA8\uFF5E",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    },
    {
      text: "\u8EAB\u4F53\u4E0D\u8981\u592A\u8D34\u8FD1\u4E66\u672C\uFF0C\u773C\u775B\u548C\u4E66\u672C\u8981\u4FDD\u6301\u4E00\u5C3A\u7684\u8DDD\u79BB\u54E6\u3002",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    },
    {
      text: "\u8BB0\u5F97\u4E24\u53EA\u811A\u5E73\u653E\u5728\u5730\u4E0A\uFF0C\u50CF\u4E00\u68F5\u5C0F\u6811\u4E00\u6837\u7AD9\u5F97\u7A33\u3002",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    }
  ];
  var focusTips = [
    {
      text: "\u521A\u521A\u6709\u70B9\u8D70\u795E\u4E86\uFF0C\u6211\u4EEC\u4E00\u8D77\u628A\u6CE8\u610F\u529B\u62C9\u56DE\u6765\u5427\uFF5E",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    },
    {
      text: "\u5148\u628A\u8FD9\u9053\u9898\u8BA4\u771F\u5B8C\u6210\uFF0C\u518D\u60F3\u522B\u7684\u4E8B\u60C5\u4E5F\u4E0D\u8FDF\u3002",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    },
    {
      text: "\u518D\u575A\u6301\u51E0\u5206\u949F\uFF0C\u4F60\u4ECA\u5929\u5C31\u4F1A\u6BD4\u6628\u5929\u66F4\u68D2\uFF01",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    }
  ];
  var efficiencyTips = [
    {
      text: "\u5982\u679C\u4E00\u9053\u9898\u5361\u4F4F\u592A\u4E45\uFF0C\u53EF\u4EE5\u5148\u505A\u540E\u9762\u7684\uFF0C\u518D\u56DE\u6765\u89E3\u51B3\u5B83\u3002",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    },
    {
      text: "\u5148\u5B8C\u6210\u7B80\u5355\u7684\u9898\u76EE\uFF0C\u7ED9\u81EA\u5DF1\u4E00\u70B9\u5C0F\u5C0F\u7684\u6210\u5C31\u611F\uFF5E",
      audio: "/static/ztjun-mstts-1766625175369.wav"
    }
  ];
  var postureTexts = postureTips.map((tip) => tip.text);
  var focusTexts = focusTips.map((tip) => tip.text);
  var efficiencyTexts = efficiencyTips.map((tip) => tip.text);
  [
    ...postureTexts,
    ...focusTexts,
    ...efficiencyTexts
  ];
  var textToAudioMap = {};
  postureTips.forEach((tip) => {
    textToAudioMap[tip.text] = tip.audio;
  });
  focusTips.forEach((tip) => {
    textToAudioMap[tip.text] = tip.audio;
  });
  efficiencyTips.forEach((tip) => {
    textToAudioMap[tip.text] = tip.audio;
  });
  var defaultAudioFiles = {
    posture: "/static/ztjun-mstts-1766625175369.wav",
    focus: "/static/ztjun-mstts-1766625175369.wav",
    efficiency: "/static/ztjun-mstts-1766625175369.wav"
  };
  function pickRandom(list) {
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }
  function playReminder(type, fixedText) {
    return __async(this, null, function* () {
      let text = fixedText;
      let audioPath = null;
      if (!text) {
        if (type === "posture") {
          text = pickRandom(postureTips);
        } else if (type === "focus") {
          text = pickRandom(focusTips);
        } else if (type === "efficiency") {
          text = pickRandom(efficiencyTips);
        } else {
          text = pickRandom(efficiencyTips);
        }
      }
      audioPath = textToAudioMap[text];
      if (!audioPath && type) {
        audioPath = defaultAudioFiles[type];
      }
      if (audioPath) {
        const audioPlayed = yield playAudio(audioPath);
        if (!audioPlayed) {
          showToast(text);
        }
      } else {
        showToast(text);
      }
      vibrate();
      return text;
    });
  }
  function showToast(text) {
    try {
      uni.showToast({
        title: text.length > 7 ? text.slice(0, 7) + "..." : text,
        icon: "none",
        duration: 2e3
      });
    } catch (e) {
      formatAppLog("warn", "at common/voiceReminder.js:76", "showToast error", e);
    }
  }
  function vibrate() {
    if (uni.vibrateShort) {
      try {
        uni.vibrateShort({});
      } catch (e) {
        formatAppLog("warn", "at common/voiceReminder.js:88", "vibrateShort error", e);
      }
    }
  }
  function playAudio(audioPath) {
    return __async(this, null, function* () {
      if (!audioPath) {
        formatAppLog("warn", "at common/voiceReminder.js:100", "\u97F3\u9891\u8DEF\u5F84\u4E3A\u7A7A");
        return false;
      }
      let processedPath = audioPath;
      if (audioPath.startsWith("/assets/")) {
        processedPath = audioPath.replace("/assets/", "/static/");
      }
      formatAppLog("log", "at common/voiceReminder.js:121", "\u539F\u59CB\u97F3\u9891\u8DEF\u5F84:", audioPath);
      formatAppLog("log", "at common/voiceReminder.js:122", "\u5904\u7406\u540E\u97F3\u9891\u8DEF\u5F84:", processedPath);
      try {
        const audioContext = uni.createInnerAudioContext();
        audioContext.src = processedPath;
        audioContext.autoplay = false;
        audioContext.loop = false;
        audioContext.volume = 1;
        return new Promise((resolve) => {
          let resolved = false;
          let playStarted = false;
          const cleanup = () => {
            if (!resolved) {
              resolved = true;
              try {
                audioContext.destroy();
              } catch (e) {
                formatAppLog("warn", "at common/voiceReminder.js:144", "\u9500\u6BC1\u97F3\u9891\u4E0A\u4E0B\u6587\u5931\u8D25:", e);
              }
            }
          };
          audioContext.onCanplay(() => {
            formatAppLog("log", "at common/voiceReminder.js:150", "\u97F3\u9891\u53EF\u4EE5\u64AD\u653E:", processedPath);
            if (!playStarted) {
              playStarted = true;
              try {
                audioContext.play();
              } catch (playError) {
                formatAppLog("error", "at common/voiceReminder.js:156", "\u5728canplay\u4E2D\u8C03\u7528play()\u5931\u8D25:", playError);
                cleanup();
                resolve(false);
              }
            }
          });
          audioContext.onPlay(() => {
            formatAppLog("log", "at common/voiceReminder.js:164", "\u97F3\u9891\u5F00\u59CB\u64AD\u653E:", processedPath);
            if (!resolved) {
              resolved = true;
              resolve(true);
            }
          });
          audioContext.onError((error) => {
            formatAppLog("error", "at common/voiceReminder.js:172", "\u97F3\u9891\u64AD\u653E\u5931\u8D25:", processedPath, error);
            cleanup();
            resolve(false);
          });
          audioContext.onEnded(() => {
            formatAppLog("log", "at common/voiceReminder.js:178", "\u97F3\u9891\u64AD\u653E\u7ED3\u675F:", processedPath);
            cleanup();
          });
          audioContext.onStop(() => {
            formatAppLog("log", "at common/voiceReminder.js:183", "\u97F3\u9891\u64AD\u653E\u505C\u6B62:", processedPath);
            if (!resolved) {
              formatAppLog("warn", "at common/voiceReminder.js:186", "\u97F3\u9891\u7ACB\u5373\u505C\u6B62\uFF0C\u53EF\u80FD\u64AD\u653E\u5931\u8D25");
              cleanup();
              resolve(false);
            } else {
              cleanup();
            }
          });
          setTimeout(() => {
            if (!resolved) {
              formatAppLog("warn", "at common/voiceReminder.js:197", "\u97F3\u9891\u64AD\u653E\u8D85\u65F6:", processedPath);
              cleanup();
              resolve(false);
            }
          }, 8e3);
          setTimeout(() => {
            if (!playStarted && !resolved) {
              playStarted = true;
              try {
                formatAppLog("log", "at common/voiceReminder.js:208", "\u5C1D\u8BD5\u76F4\u63A5\u64AD\u653E\u97F3\u9891:", processedPath);
                audioContext.play();
              } catch (playError) {
                formatAppLog("error", "at common/voiceReminder.js:211", "\u76F4\u63A5\u8C03\u7528play()\u5931\u8D25:", playError);
                cleanup();
                resolve(false);
              }
            }
          }, 100);
        });
      } catch (error) {
        formatAppLog("error", "at common/voiceReminder.js:219", "\u521B\u5EFA\u97F3\u9891\u4E0A\u4E0B\u6587\u5931\u8D25:", error);
        return false;
      }
    });
  }
  function replayLastReminder(lastText) {
    return __async(this, null, function* () {
      if (!lastText) {
        return "";
      }
      return yield playReminder(null, lastText);
    });
  }
  var DB_NAME = "homework_photos.db";
  var TABLE_NAME = "photos";
  var db = null;
  function initDatabase() {
    return new Promise((resolve, reject) => {
      try {
        if (db) {
          formatAppLog("log", "at common/photoStorage.js:18", "SQLite \u6570\u636E\u5E93\u5DF2\u7ECF\u6253\u5F00\uFF0C\u76F4\u63A5\u4F7F\u7528");
          createTable().then(resolve).catch(reject);
          return;
        }
        plus.sqlite.openDatabase({
          name: DB_NAME,
          path: "_doc/" + DB_NAME,
          // 存储在应用文档目录
          success: () => {
            formatAppLog("log", "at common/photoStorage.js:29", "SQLite \u6570\u636E\u5E93\u6253\u5F00\u6210\u529F");
            db = true;
            createTable().then(resolve).catch(reject);
          },
          fail: (err) => {
            if (err.code === -1402 || err.message && err.message.includes("Already Open")) {
              formatAppLog("log", "at common/photoStorage.js:38", "\u6570\u636E\u5E93\u5DF2\u6253\u5F00\uFF0C\u5C1D\u8BD5\u5173\u95ED\u540E\u91CD\u65B0\u6253\u5F00");
              try {
                plus.sqlite.closeDatabase({
                  name: DB_NAME,
                  success: () => {
                    formatAppLog("log", "at common/photoStorage.js:44", "\u5DF2\u5173\u95ED\u65E7\u6570\u636E\u5E93\u8FDE\u63A5\uFF0C\u91CD\u65B0\u6253\u5F00");
                    plus.sqlite.openDatabase({
                      name: DB_NAME,
                      path: "_doc/" + DB_NAME,
                      success: () => {
                        formatAppLog("log", "at common/photoStorage.js:50", "SQLite \u6570\u636E\u5E93\u91CD\u65B0\u6253\u5F00\u6210\u529F");
                        db = true;
                        createTable().then(resolve).catch(reject);
                      },
                      fail: (err2) => {
                        formatAppLog("error", "at common/photoStorage.js:55", "SQLite \u6570\u636E\u5E93\u91CD\u65B0\u6253\u5F00\u5931\u8D25", err2);
                        reject(err2);
                      }
                    });
                  },
                  fail: (closeErr) => {
                    formatAppLog("log", "at common/photoStorage.js:61", "\u5173\u95ED\u6570\u636E\u5E93\u5931\u8D25\uFF0C\u5C1D\u8BD5\u76F4\u63A5\u6253\u5F00", closeErr);
                    db = true;
                    createTable().then(resolve).catch((tableErr) => {
                      formatAppLog("log", "at common/photoStorage.js:66", "\u521B\u5EFA\u8868\u5931\u8D25\uFF0C\u5C1D\u8BD5\u91CD\u65B0\u6253\u5F00\u6570\u636E\u5E93", tableErr);
                      plus.sqlite.openDatabase({
                        name: DB_NAME,
                        path: "_doc/" + DB_NAME,
                        success: () => {
                          formatAppLog("log", "at common/photoStorage.js:71", "SQLite \u6570\u636E\u5E93\u6253\u5F00\u6210\u529F\uFF08\u5173\u95ED\u5931\u8D25\u540E\u7684\u91CD\u8BD5\uFF09");
                          db = true;
                          createTable().then(resolve).catch(reject);
                        },
                        fail: (err3) => {
                          formatAppLog("error", "at common/photoStorage.js:76", "SQLite \u6570\u636E\u5E93\u6253\u5F00\u5931\u8D25\uFF08\u91CD\u8BD5\uFF09", err3);
                          reject(err3);
                        }
                      });
                    });
                  }
                });
              } catch (e) {
                formatAppLog("error", "at common/photoStorage.js:84", "\u5904\u7406\u6570\u636E\u5E93\u6253\u5F00\u5F02\u5E38", e);
                reject(e);
              }
            } else {
              formatAppLog("error", "at common/photoStorage.js:88", "SQLite \u6570\u636E\u5E93\u6253\u5F00\u5931\u8D25", err);
              reject(err);
            }
          }
        });
      } catch (e) {
        formatAppLog("error", "at common/photoStorage.js:94", "\u521D\u59CB\u5316 SQLite \u5F02\u5E38", e);
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
            formatAppLog("log", "at common/photoStorage.js:133", "\u65E7\u8868\u5DF2\u5220\u9664\uFF08\u5982\u679C\u5B58\u5728\uFF09");
            plus.sqlite.executeSql({
              name: DB_NAME,
              sql: createSql,
              success: () => {
                formatAppLog("log", "at common/photoStorage.js:139", "\u7167\u7247\u8868\u521B\u5EFA\u6210\u529F");
                db = true;
                resolve();
              },
              fail: (err) => {
                formatAppLog("error", "at common/photoStorage.js:145", "\u7167\u7247\u8868\u521B\u5EFA\u5931\u8D25", err);
                reject(err);
              }
            });
          },
          fail: (err) => {
            formatAppLog("warn", "at common/photoStorage.js:151", "\u5220\u9664\u65E7\u8868\u5931\u8D25\uFF08\u53EF\u80FD\u8868\u4E0D\u5B58\u5728\uFF09", err);
            plus.sqlite.executeSql({
              name: DB_NAME,
              sql: createSql,
              success: () => {
                formatAppLog("log", "at common/photoStorage.js:157", "\u7167\u7247\u8868\u521B\u5EFA\u6210\u529F\uFF08\u5220\u9664\u5931\u8D25\u540E\uFF09");
                db = true;
                resolve();
              },
              fail: (err2) => {
                formatAppLog("error", "at common/photoStorage.js:162", "\u7167\u7247\u8868\u521B\u5EFA\u5931\u8D25", err2);
                reject(err2);
              }
            });
          }
        });
      } catch (e) {
        formatAppLog("error", "at common/photoStorage.js:169", "\u6267\u884C\u521B\u5EFA\u8868 SQL \u5F02\u5E38", e);
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
          formatAppLog("error", "at common/photoStorage.js:200", "\u521D\u59CB\u5316\u6570\u636E\u5E93\u5931\u8D25\uFF0C\u7167\u7247\u4FE1\u606F\u5C06\u4EC5\u4FDD\u5B58\u5728\u5185\u5B58\u4E2D", err);
          resolve();
        });
        return;
      }
      _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText).then(resolve).catch((err) => {
        formatAppLog("error", "at common/photoStorage.js:210", "\u4FDD\u5B58\u7167\u7247\u5230\u6570\u636E\u5E93\u5931\u8D25\uFF0C\u4F46\u7167\u7247\u5DF2\u5728\u5185\u5B58\u4E2D", err);
        resolve();
      });
    });
  }
  function _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText) {
    return new Promise((resolve, reject) => {
      if (!sessionId || !photoPath || photoPath.trim() === "" || !timestamp || elapsedTime === void 0 || elapsedTime === null) {
        const error = new Error("\u4FDD\u5B58\u7167\u7247\u5931\u8D25\uFF1A\u5FC5\u586B\u5B57\u6BB5\u7F3A\u5931");
        formatAppLog("error", "at common/photoStorage.js:246", "\u4FDD\u5B58\u7167\u7247\u53C2\u6570\u68C0\u67E5\u5931\u8D25", {
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
        const error = new Error("sessionId \u65E0\u6548: " + sessionId);
        formatAppLog("error", "at common/photoStorage.js:275", "sessionId \u9A8C\u8BC1\u5931\u8D25", { sessionId, safeSessionId });
        reject(error);
        return;
      }
      if (!safePhotoPath || safePhotoPath === "undefined" || safePhotoPath === "null") {
        const error = new Error("photoPath \u65E0\u6548: " + photoPath);
        formatAppLog("error", "at common/photoStorage.js:282", "photoPath \u9A8C\u8BC1\u5931\u8D25", { photoPath, safePhotoPath });
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
      formatAppLog("log", "at common/photoStorage.js:300", "\u51C6\u5907\u4FDD\u5B58\u7167\u7247\u5230\u6570\u636E\u5E93", {
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
          formatAppLog("log", "at common/photoStorage.js:314", "\u7167\u7247\u4FDD\u5B58\u6210\u529F", { sessionId: safeSessionId, timestamp: safeTimestamp });
          resolve();
        },
        fail: (err) => {
          formatAppLog("error", "at common/photoStorage.js:318", "\u7167\u7247\u4FDD\u5B58\u5931\u8D25", err);
          formatAppLog("error", "at common/photoStorage.js:319", "\u4FDD\u5B58\u53C2\u6570\u8BE6\u60C5", {
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
  var _style_0 = { "page": { "": { "flex": 1, "backgroundColor": "#f3f7ff", "paddingLeft": "16rpx", "paddingRight": "16rpx", "paddingTop": "16rpx", "paddingBottom": "140rpx" } }, "top-card": { "": { "backgroundColor": "#ffffff", "borderRadius": "24rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "16rpx" } }, "time-row": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "12rpx" } }, "time-block": { "": { "flex": 1 } }, "time-label": { "": { "fontSize": "24rpx", "color": "#555555" } }, "time-value": { "": { "fontSize": "34rpx", "fontWeight": "600", "color": "#2c405a", "marginTop": "4rpx" } }, "progress-bar": { "": { "height": "14rpx", "borderRadius": "7rpx", "backgroundColor": "#f0f3fa", "overflow": "hidden" } }, "progress-inner": { "": { "height": "14rpx", "borderRadius": "7rpx", "backgroundColor": "#4ba3ff" } }, "camera-card": { "": { "marginTop": "12rpx", "marginBottom": "16rpx", "borderRadius": "24rpx", "backgroundColor": "#ffffff", "overflow": "hidden" } }, "camera-view-wrapper": { "": { "width": "750rpx", "height": "520rpx", "position": "relative", "backgroundColor": "#000000", "overflow": "hidden" } }, "camera-view": { "": { "width": "750rpx", "height": "520rpx", "backgroundColor": "#000000" } }, "camera-placeholder": { "": { "position": "absolute", "top": 0, "left": 0, "width": "750rpx", "height": "520rpx", "backgroundColor": "#1a1a1a", "alignItems": "center", "justifyContent": "center", "flexDirection": "column", "zIndex": 1 } }, "placeholder-text": { "": { "fontSize": "32rpx", "color": "#ffffff", "marginBottom": "12rpx" } }, "placeholder-subtitle": { "": { "fontSize": "24rpx", "color": "#999999" } }, "camera-overlay": { "": { "paddingTop": "16rpx", "paddingRight": "20rpx", "paddingBottom": "18rpx", "paddingLeft": "20rpx" } }, "camera-title": { "": { "fontSize": "30rpx", "fontWeight": "600", "color": "#2c405a", "marginBottom": "6rpx" } }, "camera-subtitle": { "": { "fontSize": "24rpx", "color": "#555555" } }, "switch-row": { "": { "marginTop": "10rpx" } }, "camera-tip": { "": { "fontSize": "22rpx", "color": "#888888", "marginBottom": "6rpx" } }, "switch-btn": { "": { "paddingLeft": "22rpx", "paddingRight": "22rpx", "paddingTop": "8rpx", "paddingBottom": "8rpx", "borderRadius": "32rpx", "backgroundColor": "#e6f1ff" } }, "switch-text": { "": { "fontSize": "24rpx", "color": "#2f80ff" } }, "debug-panel": { "": { "marginTop": "12rpx", "paddingTop": "12rpx", "paddingRight": "12rpx", "paddingBottom": "12rpx", "paddingLeft": "12rpx", "backgroundColor": "#fff3cd", "borderRadius": "8rpx", "borderWidth": "1rpx", "borderColor": "#ffc107" } }, "debug-title": { "": { "fontSize": "26rpx", "fontWeight": "600", "color": "#856404", "marginBottom": "8rpx" } }, "debug-item": { "": { "fontSize": "22rpx", "color": "#856404", "marginBottom": "4rpx", "lines": 3 } }, "debug-error": { "": { "color": "#dc3545" } }, "debug-btn-row": { "": { "flexDirection": "row", "marginTop": "8rpx", "justifyContent": "space-between" } }, "debug-btn": { "": { "flex": 1, "marginRight": "8rpx", "paddingTop": "6rpx", "paddingRight": "12rpx", "paddingBottom": "6rpx", "paddingLeft": "12rpx", "backgroundColor": "#ffc107", "borderRadius": "6rpx", "alignItems": "center", "justifyContent": "center", "marginRight:last-child": 0 } }, "debug-btn-text": { "": { "fontSize": "22rpx", "color": "#856404" } }, "debug-toggle": { "": { "marginTop": "8rpx", "alignItems": "center" } }, "debug-toggle-btn": { "": { "paddingTop": "6rpx", "paddingRight": "16rpx", "paddingBottom": "6rpx", "paddingLeft": "16rpx", "backgroundColor": "#e6f1ff", "borderRadius": "6rpx" } }, "debug-toggle-text": { "": { "fontSize": "22rpx", "color": "#2f80ff" } }, "status-row": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "8rpx" } }, "status-card": { "": { "flex": 1, "marginRight": "8rpx", "borderRadius": "20rpx", "paddingTop": "14rpx", "paddingRight": "16rpx", "paddingBottom": "14rpx", "paddingLeft": "16rpx", "backgroundColor": "#f5f7fb", "marginRight:last-child": 0 } }, "status-label": { "": { "fontSize": "24rpx", "color": "#555555" } }, "status-value": { "": { "fontSize": "28rpx", "fontWeight": "600", "marginTop": "4rpx" }, ".status-good ": { "color": "#2f9b59" }, ".status-focus ": { "color": "#2f9b59" }, ".status-bend ": { "color": "#f0ad4e" }, ".status-distract ": { "color": "#f0ad4e" }, ".status-idle ": { "color": "#f0ad4e" }, ".status-lie ": { "color": "#dd524d" }, ".status-leave ": { "color": "#dd524d" } }, "encourage": { "": { "marginTop": "4rpx", "marginBottom": "8rpx" } }, "encourage-text": { "": { "fontSize": "26rpx", "color": "#2f9b59" } }, "reminder-card": { "": { "borderRadius": "24rpx", "backgroundColor": "#ffffff", "paddingTop": "18rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "8rpx" } }, "reminder-header": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "8rpx" } }, "reminder-title": { "": { "fontSize": "28rpx", "fontWeight": "600", "color": "#2c405a" } }, "reminder-count": { "": { "fontSize": "24rpx", "color": "#555555" } }, "reminder-content": { "": { "flexDirection": "row", "alignItems": "center" } }, "reminder-icon": { "": { "fontSize": "30rpx", "marginRight": "6rpx" } }, "reminder-text": { "": { "fontSize": "26rpx", "color": "#3f536e" } }, "reminder-empty": { "": { "fontSize": "26rpx", "color": "#3f536e" } }, "bottom-area": { "": { "position": "fixed", "left": 0, "right": 0, "bottom": "40rpx", "paddingLeft": "32rpx", "paddingRight": "32rpx" } }, "danger-btn": { "": { "height": "88rpx", "borderRadius": "44rpx", "backgroundColor": "#ff6b6b", "alignItems": "center", "justifyContent": "center" } }, "danger-text": { "": { "fontSize": "32rpx", "color": "#ffffff" } } };
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  var _sfc_main = {
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
        permissionStatus: "\u672A\u77E5",
        cameraStatus: "\u672A\u77E5",
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
          good: "\u5750\u59FF\u7AEF\u6B63",
          bend: "\u6709\u70B9\u8DB4\u684C",
          lie: "\u51E0\u4E4E\u8DB4\u4E0B\u4E86",
          leave: "\u79BB\u5F00\u5EA7\u4F4D"
        };
        return map[this.postureState] || "\u5750\u59FF\u7AEF\u6B63";
      },
      focusLabel() {
        const map = {
          focus: "\u5F88\u4E13\u5FC3",
          distract: "\u6709\u70B9\u8D70\u795E"
        };
        return map[this.focusState] || "\u5F88\u4E13\u5FC3";
      },
      taskLabel() {
        const map = {
          writing: "\u6B63\u5728\u4E66\u5199",
          thinking: "\u5728\u601D\u8003",
          idle: "\u5728\u53D1\u5446"
        };
        return map[this.taskState] || "\u6B63\u5728\u4E66\u5199";
      },
      encourageText() {
        if (this.postureState === "good" && this.focusState === "focus") {
          return "\u73B0\u5728\u7684\u72B6\u6001\u5F88\u68D2\uFF0C\u7EE7\u7EED\u4FDD\u6301\u54E6\uFF01";
        }
        return "";
      }
    },
    created() {
      const query = this.$route && this.$route.query ? this.$route.query : {};
      this.startTime = Number(query.startTime) || Date.now();
      this.expectedDuration = Number(query.expectedDuration) || 30 * 60 * 1e3;
      this.sessionId = String(this.startTime);
      formatAppLog("log", "at pages/session/doing.nvue:214", "created: \u521D\u59CB\u5316 sessionId", this.sessionId, "startTime", this.startTime);
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
        formatAppLog("log", "at pages/session/doing.nvue:232", "onShow: \u521D\u59CB\u5316 sessionId", this.sessionId);
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
            formatAppLog("log", "at pages/session/doing.nvue:287", "\u68C0\u6D4B\u72B6\u6001:", {
              posture: snapshot.postureState,
              focus: snapshot.focusState,
              isBad,
              badStreak: this.badStreak
            });
            if (isBad) {
              this.badStreak += 1;
            } else {
              this.badStreak = 0;
            }
            if (this.badStreak >= 1) {
              formatAppLog("log", "at pages/session/doing.nvue:301", "\u89E6\u53D1\u63D0\u9192!", snapshot);
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
        }, 3e4);
      },
      /**
       * 拍照
       */
      capturePhoto() {
        if (!this.pusherContext || !this.pusherReady) {
          formatAppLog("log", "at pages/session/doing.nvue:330", "\u6444\u50CF\u5934\u672A\u51C6\u5907\u597D\uFF0C\u65E0\u6CD5\u62CD\u7167");
          return;
        }
        try {
          this.pusherContext.snapshot({
            quality: "high",
            // 高质量
            success: (res) => __async(this, null, function* () {
              formatAppLog("log", "at pages/session/doing.nvue:341", "snapshot \u8FD4\u56DE\u6570\u636E", res);
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
                formatAppLog("error", "at pages/session/doing.nvue:359", "\u62CD\u7167\u5931\u8D25\uFF1A\u672A\u83B7\u53D6\u5230\u7167\u7247\u8DEF\u5F84", res);
                uni.showToast({
                  title: "\u62CD\u7167\u5931\u8D25\uFF1A\u672A\u83B7\u53D6\u5230\u7167\u7247\u8DEF\u5F84",
                  icon: "none",
                  duration: 2e3
                });
                return;
              }
              formatAppLog("log", "at pages/session/doing.nvue:368", "\u83B7\u53D6\u5230\u7167\u7247\u8DEF\u5F84", photoPath);
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
              formatAppLog("log", "at pages/session/doing.nvue:383", "\u62CD\u7167\u6210\u529F", photoInfo);
              try {
                if (!this.sessionId || this.sessionId === "" || this.sessionId === "0") {
                  this.sessionId = String(this.startTime);
                  formatAppLog("warn", "at pages/session/doing.nvue:390", "capturePhoto: sessionId \u4E3A\u7A7A\uFF0C\u91CD\u65B0\u521D\u59CB\u5316", this.sessionId);
                }
                formatAppLog("log", "at pages/session/doing.nvue:393", "\u51C6\u5907\u4FDD\u5B58\u7167\u7247\uFF0CsessionId:", this.sessionId, "photoPath:", photoPath.substring(0, 50));
                yield savePhoto(
                  this.sessionId,
                  photoPath,
                  timestamp,
                  elapsedTime,
                  elapsedText
                );
                formatAppLog("log", "at pages/session/doing.nvue:402", "\u7167\u7247\u5DF2\u4FDD\u5B58\u5230\u6570\u636E\u5E93");
              } catch (dbErr) {
                formatAppLog("error", "at pages/session/doing.nvue:404", "\u4FDD\u5B58\u7167\u7247\u5230\u6570\u636E\u5E93\u5931\u8D25", dbErr);
                formatAppLog("error", "at pages/session/doing.nvue:405", "\u5931\u8D25\u65F6\u7684 sessionId:", this.sessionId, "\u7C7B\u578B:", typeof this.sessionId);
              }
              uni.showToast({
                title: `\u5DF2\u4FDD\u5B58\u7167\u7247 (${this.photos.length}\u5F20)`,
                icon: "none",
                duration: 1e3
              });
            }),
            fail: (err) => {
              formatAppLog("error", "at pages/session/doing.nvue:417", "\u62CD\u7167\u5931\u8D25", err);
            }
          });
        } catch (e) {
          formatAppLog("error", "at pages/session/doing.nvue:421", "\u62CD\u7167\u5F02\u5E38", e);
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
      triggerReminder(snapshot) {
        return __async(this, null, function* () {
          const type = snapshot.postureState !== "good" ? "posture" : "focus";
          const text = yield playReminder(type);
          this.lastReminderText = text;
          this.reminderCount += 1;
          this.reminders.push({
            timestamp: Date.now(),
            type,
            text
          });
        });
      },
      replayLastReminder() {
        return __async(this, null, function* () {
          if (!this.lastReminderText)
            return;
          yield replayLastReminder(this.lastReminderText);
        });
      },
      switchCamera() {
        this.devicePosition = this.devicePosition === "front" ? "back" : "front";
        this.cameraStatus = `\u6B63\u5728\u5207\u6362\u5230${this.devicePosition === "front" ? "\u524D\u7F6E" : "\u540E\u7F6E"}\u6444\u50CF\u5934...`;
        if (this.pusherContext) {
          try {
            this.pusherContext.switchCamera({
              success: () => {
                formatAppLog("log", "at pages/session/doing.nvue:463", "\u6444\u50CF\u5934\u5207\u6362\u6210\u529F");
              },
              fail: (err) => {
                formatAppLog("log", "at pages/session/doing.nvue:466", "\u6444\u50CF\u5934\u5207\u6362\u5931\u8D25", err);
              }
            });
          } catch (e) {
            formatAppLog("log", "at pages/session/doing.nvue:470", "switchCamera \u65B9\u6CD5\u53EF\u80FD\u4E0D\u652F\u6301\uFF0C\u4F7F\u7528 device-position \u5C5E\u6027\u5207\u6362");
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
            formatAppLog("log", "at pages/session/doing.nvue:504", "live-pusher context created", this.pusherContext);
          } catch (e) {
            formatAppLog("error", "at pages/session/doing.nvue:506", "\u521B\u5EFA live-pusher context \u5931\u8D25", e);
            setTimeout(() => {
              try {
                this.pusherContext = uni.createLivePusherContext("livePusher", this);
                formatAppLog("log", "at pages/session/doing.nvue:511", "live-pusher context \u91CD\u8BD5\u6210\u529F", this.pusherContext);
              } catch (e2) {
                formatAppLog("error", "at pages/session/doing.nvue:513", "live-pusher context \u91CD\u8BD5\u4E5F\u5931\u8D25", e2);
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
          formatAppLog("log", "at pages/session/doing.nvue:529", "\u6743\u9650\u672A\u6388\u4E88\uFF0C\u7B49\u5F85\u6743\u9650\u6388\u4E88\u540E\u518D\u542F\u52A8");
          return;
        }
        if (!this.pusherContext) {
          formatAppLog("log", "at pages/session/doing.nvue:534", "pusherContext \u4E0D\u5B58\u5728\uFF0C\u91CD\u65B0\u521D\u59CB\u5316");
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
          formatAppLog("error", "at pages/session/doing.nvue:551", "pusherContext \u4ECD\u7136\u4E0D\u5B58\u5728");
          return;
        }
        if (typeof this.pusherContext.startPreview === "function") {
          this.pusherContext.startPreview({
            success: () => {
              this.pusherReady = true;
              this.cameraStatus = "\u6444\u50CF\u5934\u9884\u89C8\u5DF2\u542F\u52A8 \u2713";
              formatAppLog("log", "at pages/session/doing.nvue:561", "live-pusher \u9884\u89C8\u542F\u52A8\u6210\u529F");
            },
            fail: (err) => {
              formatAppLog("error", "at pages/session/doing.nvue:564", "live-pusher startPreview \u5931\u8D25", err);
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
            this.cameraStatus = "\u6444\u50CF\u5934\u9884\u89C8\u5DF2\u542F\u52A8 \u2713";
            formatAppLog("log", "at pages/session/doing.nvue:585", "live-pusher start \u65B9\u6CD5\u6210\u529F");
          },
          fail: (err) => {
            this.cameraStatus = "\u542F\u52A8\u5931\u8D25: " + JSON.stringify(err);
            this.cameraError = JSON.stringify(err);
            formatAppLog("error", "at pages/session/doing.nvue:590", "live-pusher start \u65B9\u6CD5\u5931\u8D25", err);
            const errorMsg = err.errMsg || err.message || JSON.stringify(err);
            formatAppLog("error", "at pages/session/doing.nvue:594", "\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F:", errorMsg);
            if (!this.showDebugInfo) {
              this.showDebugInfo = true;
            }
            uni.showToast({
              title: "\u6444\u50CF\u5934\u542F\u52A8\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u4FE1\u606F",
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
              formatAppLog("log", "at pages/session/doing.nvue:618", "live-pusher \u9884\u89C8\u5DF2\u505C\u6B62");
            },
            fail: () => {
              this.pusherContext.stop({
                success: () => {
                  this.pusherReady = false;
                  formatAppLog("log", "at pages/session/doing.nvue:625", "live-pusher \u5DF2\u505C\u6B62");
                },
                fail: (err) => {
                  formatAppLog("log", "at pages/session/doing.nvue:628", "live-pusher \u505C\u6B62\u5931\u8D25", err);
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
          this.permissionStatus = "\u8BF7\u6C42\u4E2D...";
          plus.android.requestPermissions(
            ["android.permission.CAMERA"],
            (resultObj) => {
              const granted = resultObj.granted && resultObj.granted.length > 0;
              if (granted) {
                this.permissionStatus = "\u5DF2\u6388\u4E88";
                this.permissionGranted = true;
                formatAppLog("log", "at pages/session/doing.nvue:652", "\u6444\u50CF\u5934\u6743\u9650\u5DF2\u6388\u4E88", resultObj);
                setTimeout(() => {
                  this.startLivePusher();
                }, 300);
              } else {
                this.permissionStatus = "\u88AB\u62D2\u7EDD";
                this.permissionGranted = false;
                formatAppLog("log", "at pages/session/doing.nvue:661", "\u6444\u50CF\u5934\u6743\u9650\u88AB\u62D2\u7EDD", resultObj);
              }
            },
            (err) => {
              this.permissionStatus = "\u8BF7\u6C42\u5931\u8D25: " + JSON.stringify(err);
              this.permissionGranted = false;
              formatAppLog("log", "at pages/session/doing.nvue:667", "\u6444\u50CF\u5934\u6743\u9650\u8BF7\u6C42\u5931\u8D25: " + JSON.stringify(err));
              uni.showToast({
                title: "\u672A\u6388\u4E88\u6444\u50CF\u5934\u6743\u9650\uFF0C\u65E0\u6CD5\u9884\u89C8\u753B\u9762",
                icon: "none",
                duration: 3e3
              });
            }
          );
        } catch (e) {
          this.permissionStatus = "\u5F02\u5E38: " + e.toString();
          this.permissionGranted = false;
          formatAppLog("log", "at pages/session/doing.nvue:678", "\u6444\u50CF\u5934\u6743\u9650\u8BF7\u6C42\u5F02\u5E38: " + e);
        }
      },
      /**
       * live-pusher 状态变化事件
       */
      onPusherStateChange(e) {
        formatAppLog("log", "at pages/session/doing.nvue:695", "live-pusher state change", e);
        const code = e.detail.code;
        switch (code) {
          case 1001:
            this.cameraStatus = "\u5DF2\u8FDE\u63A5\u63A8\u6D41\u670D\u52A1\u5668";
            break;
          case 1002:
            this.pusherReady = true;
            this.cameraStatus = "\u6444\u50CF\u5934\u9884\u89C8\u5DF2\u542F\u52A8 \u2713";
            break;
          case 1003:
            this.pusherReady = true;
            this.cameraStatus = "\u6444\u50CF\u5934\u753B\u9762\u5DF2\u663E\u793A \u2713";
            break;
          case 1004:
            this.pusherReady = true;
            this.cameraStatus = "\u6444\u50CF\u5934\u753B\u9762\u5DF2\u663E\u793A \u2713";
            break;
          case 1005:
            break;
          case 1006:
            this.cameraStatus = "\u89C6\u9891\u64AD\u653E\u7ED3\u675F";
            break;
          case 1007:
            this.cameraStatus = "\u89C6\u9891\u52A0\u8F7D\u4E2D...";
            break;
          case 1008:
            this.cameraStatus = "\u89E3\u7801\u5668\u542F\u52A8";
            break;
          case -1301:
            this.cameraError = "\u6253\u5F00\u6444\u50CF\u5934\u5931\u8D25";
            this.cameraStatus = "\u6253\u5F00\u6444\u50CF\u5934\u5931\u8D25";
            if (!this.showDebugInfo) {
              this.showDebugInfo = true;
            }
            break;
          case -1302:
            this.cameraError = "\u6253\u5F00\u9EA6\u514B\u98CE\u5931\u8D25";
            break;
          case -1303:
            this.cameraError = "\u89C6\u9891\u7F16\u7801\u5931\u8D25";
            break;
          case -1304:
            this.cameraError = "\u97F3\u9891\u7F16\u7801\u5931\u8D25";
            break;
          case -1305:
            this.cameraError = "\u4E0D\u652F\u6301\u7684\u89C6\u9891\u5206\u8FA8\u7387";
            break;
          case -1306:
            this.cameraError = "\u4E0D\u652F\u6301\u7684\u97F3\u9891\u91C7\u6837\u7387";
            break;
          case -1307:
            this.cameraError = "\u7F51\u7EDC\u65AD\u8FDE";
            this.cameraStatus = "\u7F51\u7EDC\u65AD\u8FDE";
            break;
          case -1308:
            this.cameraError = "\u5F00\u59CB\u5F55\u5C4F\u5931\u8D25";
            break;
          case -1309:
            this.cameraError = "\u5F55\u5C4F\u5931\u8D25";
            break;
          default:
            formatAppLog("log", "at pages/session/doing.nvue:759", "\u672A\u77E5\u72B6\u6001\u7801:", code);
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
        formatAppLog("error", "at pages/session/doing.nvue:775", "live-pusher error", e);
        this.cameraError = "live-pusher \u9519\u8BEF: " + JSON.stringify(e.detail);
        this.cameraStatus = "\u6444\u50CF\u5934\u9519\u8BEF";
        if (!this.showDebugInfo) {
          this.showDebugInfo = true;
        }
        uni.showToast({
          title: "\u6444\u50CF\u5934\u9519\u8BEF\uFF0C\u8BF7\u67E5\u770B\u8C03\u8BD5\u4FE1\u606F",
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
          this.permissionStatus = `\u6743\u9650\u68C0\u67E5: ${granted ? "\u5DF2\u6388\u4E88" : "\u672A\u6388\u4E88"}`;
          if (this.pusherReady) {
            this.cameraStatus = `live-pusher \u5DF2\u542F\u52A8 (\u8BBE\u5907\u652F\u6301: ${hasCamera ? "\u662F" : "\u5426"}, \u6570\u91CF: ${cameraCount})`;
          } else {
            this.cameraStatus = `\u7B49\u5F85 live-pusher \u542F\u52A8... (\u8BBE\u5907\u652F\u6301: ${hasCamera ? "\u662F" : "\u5426"}, \u6570\u91CF: ${cameraCount}, \u6743\u9650: ${granted ? "\u5DF2\u6388\u4E88" : "\u672A\u6388\u4E88"})`;
          }
        } catch (e) {
          this.cameraStatus = "\u68C0\u67E5\u5931\u8D25: " + e.toString();
          formatAppLog("log", "at pages/session/doing.nvue:823", "\u68C0\u67E5\u6444\u50CF\u5934\u72B6\u6001\u5931\u8D25", e);
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue.createElementVNode)("view", { class: "page doing-page" }, [
        (0, import_vue.createElementVNode)("view", { class: "top-card" }, [
          (0, import_vue.createElementVNode)("view", { class: "time-row" }, [
            (0, import_vue.createElementVNode)("view", { class: "time-block" }, [
              (0, import_vue.createElementVNode)("u-text", { class: "time-label" }, "\u5DF2\u7528\u65F6\u95F4"),
              (0, import_vue.createElementVNode)(
                "u-text",
                { class: "time-value" },
                (0, import_vue.toDisplayString)($options.elapsedText),
                1
                /* TEXT */
              )
            ]),
            (0, import_vue.createElementVNode)("view", { class: "time-block" }, [
              (0, import_vue.createElementVNode)("u-text", { class: "time-label" }, "\u9884\u8BA1"),
              (0, import_vue.createElementVNode)(
                "u-text",
                { class: "time-value" },
                (0, import_vue.toDisplayString)($options.expectedText),
                1
                /* TEXT */
              )
            ])
          ]),
          (0, import_vue.createElementVNode)("view", { class: "progress-bar" }, [
            (0, import_vue.createElementVNode)(
              "view",
              {
                class: "progress-inner",
                style: (0, import_vue.normalizeStyle)({ width: $options.progressPercent + "%" })
              },
              null,
              4
              /* STYLE */
            )
          ])
        ]),
        (0, import_vue.createElementVNode)("view", { class: "camera-card" }, [
          (0, import_vue.createElementVNode)("view", { class: "camera-view-wrapper" }, [
            (0, import_vue.createElementVNode)("live-pusher", {
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
            !$data.pusherReady ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("view", {
              key: 0,
              class: "camera-placeholder"
            }, [
              (0, import_vue.createElementVNode)("u-text", { class: "placeholder-text" }, "\u6444\u50CF\u5934\u9884\u89C8\u533A\u57DF"),
              (0, import_vue.createElementVNode)(
                "u-text",
                { class: "placeholder-subtitle" },
                (0, import_vue.toDisplayString)($data.permissionGranted ? "\u6B63\u5728\u542F\u52A8\u6444\u50CF\u5934..." : "\u6743\u9650\u6388\u4E88\u540E\u5C06\u663E\u793A\u5B9E\u65F6\u753B\u9762"),
                1
                /* TEXT */
              )
            ])) : (0, import_vue.createCommentVNode)("v-if", true)
          ]),
          (0, import_vue.createElementVNode)("view", { class: "camera-overlay" }, [
            (0, import_vue.createElementVNode)("u-text", { class: "camera-title" }, "\u5B9E\u65F6\u6444\u50CF\u5934\u9884\u89C8"),
            (0, import_vue.createElementVNode)(
              "u-text",
              { class: "camera-subtitle" },
              " \u5F53\u524D\u4F7F\u7528\uFF1A" + (0, import_vue.toDisplayString)($data.devicePosition === "front" ? "\u524D\u7F6E\u6444\u50CF\u5934" : "\u540E\u7F6E\u6444\u50CF\u5934"),
              1
              /* TEXT */
            ),
            (0, import_vue.createElementVNode)("view", { class: "switch-row" }, [
              (0, import_vue.createElementVNode)("u-text", { class: "camera-tip" }, "\u4FDD\u6301\u8138\u90E8\u51FA\u73B0\u5728\u753B\u9762\u4E2D\u95F4\uFF0C\u66F4\u5BB9\u6613\u8BC6\u522B\u59FF\u6001\uFF5E"),
              (0, import_vue.createElementVNode)("view", {
                class: "switch-btn",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.switchCamera && $options.switchCamera(...args))
              }, [
                (0, import_vue.createElementVNode)(
                  "u-text",
                  { class: "switch-text" },
                  " \u5207\u6362\u4E3A" + (0, import_vue.toDisplayString)($data.devicePosition === "front" ? "\u540E\u7F6E" : "\u524D\u7F6E") + "\u6444\u50CF\u5934 ",
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          $data.showDebugInfo ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("view", {
            key: 0,
            class: "debug-panel"
          }, [
            (0, import_vue.createElementVNode)("u-text", { class: "debug-title" }, "\u8C03\u8BD5\u4FE1\u606F"),
            (0, import_vue.createElementVNode)(
              "u-text",
              { class: "debug-item" },
              "\u6743\u9650\u72B6\u6001: " + (0, import_vue.toDisplayString)($data.permissionStatus),
              1
              /* TEXT */
            ),
            (0, import_vue.createElementVNode)(
              "u-text",
              { class: "debug-item" },
              "\u6444\u50CF\u5934\u72B6\u6001: " + (0, import_vue.toDisplayString)($data.cameraStatus),
              1
              /* TEXT */
            ),
            $data.cameraError ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)(
              "u-text",
              {
                key: 0,
                class: "debug-item debug-error"
              },
              "\u9519\u8BEF\u4FE1\u606F: " + (0, import_vue.toDisplayString)($data.cameraError),
              1
              /* TEXT */
            )) : (0, import_vue.createCommentVNode)("v-if", true),
            $data.cameraErrorDetail ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)(
              "u-text",
              {
                key: 1,
                class: "debug-item debug-error"
              },
              "\u9519\u8BEF\u8BE6\u60C5: " + (0, import_vue.toDisplayString)($data.cameraErrorDetail),
              1
              /* TEXT */
            )) : (0, import_vue.createCommentVNode)("v-if", true),
            (0, import_vue.createElementVNode)("view", { class: "debug-btn-row" }, [
              (0, import_vue.createElementVNode)("view", {
                class: "debug-btn",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.toggleDebugInfo && $options.toggleDebugInfo(...args))
              }, [
                (0, import_vue.createElementVNode)("u-text", { class: "debug-btn-text" }, "\u9690\u85CF\u8C03\u8BD5")
              ]),
              (0, import_vue.createElementVNode)("view", {
                class: "debug-btn",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.checkCameraStatus && $options.checkCameraStatus(...args))
              }, [
                (0, import_vue.createElementVNode)("u-text", { class: "debug-btn-text" }, "\u68C0\u67E5\u72B6\u6001")
              ])
            ])
          ])) : ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("view", {
            key: 1,
            class: "debug-toggle"
          }, [
            (0, import_vue.createElementVNode)("view", {
              class: "debug-toggle-btn",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.toggleDebugInfo && $options.toggleDebugInfo(...args))
            }, [
              (0, import_vue.createElementVNode)("u-text", { class: "debug-toggle-text" }, "\u663E\u793A\u8C03\u8BD5\u4FE1\u606F")
            ])
          ]))
        ]),
        (0, import_vue.createElementVNode)("view", { class: "status-row" }, [
          (0, import_vue.createElementVNode)(
            "view",
            {
              class: (0, import_vue.normalizeClass)(["status-card", "status-" + $data.postureState])
            },
            [
              (0, import_vue.createElementVNode)("u-text", { class: "status-label" }, "\u5750\u59FF"),
              (0, import_vue.createElementVNode)(
                "u-text",
                { class: "status-value" },
                (0, import_vue.toDisplayString)($options.postureLabel),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          ),
          (0, import_vue.createElementVNode)(
            "view",
            {
              class: (0, import_vue.normalizeClass)(["status-card", "status-" + $data.focusState])
            },
            [
              (0, import_vue.createElementVNode)("u-text", { class: "status-label" }, "\u4E13\u6CE8"),
              (0, import_vue.createElementVNode)(
                "u-text",
                { class: "status-value" },
                (0, import_vue.toDisplayString)($options.focusLabel),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          ),
          (0, import_vue.createElementVNode)(
            "view",
            {
              class: (0, import_vue.normalizeClass)(["status-card", "status-" + $data.taskState])
            },
            [
              (0, import_vue.createElementVNode)("u-text", { class: "status-label" }, "\u72B6\u6001"),
              (0, import_vue.createElementVNode)(
                "u-text",
                { class: "status-value" },
                (0, import_vue.toDisplayString)($options.taskLabel),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ]),
        $options.encourageText ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("view", {
          key: 0,
          class: "encourage"
        }, [
          (0, import_vue.createElementVNode)(
            "u-text",
            { class: "encourage-text" },
            (0, import_vue.toDisplayString)($options.encourageText),
            1
            /* TEXT */
          )
        ])) : (0, import_vue.createCommentVNode)("v-if", true),
        (0, import_vue.createElementVNode)("view", { class: "reminder-card" }, [
          (0, import_vue.createElementVNode)("view", { class: "reminder-header" }, [
            (0, import_vue.createElementVNode)("u-text", { class: "reminder-title" }, "\u6700\u8FD1\u63D0\u9192"),
            (0, import_vue.createElementVNode)(
              "u-text",
              { class: "reminder-count" },
              "\u5171 " + (0, import_vue.toDisplayString)($data.reminderCount) + " \u6B21",
              1
              /* TEXT */
            )
          ]),
          $data.lastReminderText ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("view", {
            key: 0,
            class: "reminder-content",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.replayLastReminder && $options.replayLastReminder(...args))
          }, [
            (0, import_vue.createElementVNode)("u-text", { class: "reminder-icon" }, "\u{1F514}"),
            (0, import_vue.createElementVNode)(
              "u-text",
              { class: "reminder-text" },
              (0, import_vue.toDisplayString)($data.lastReminderText),
              1
              /* TEXT */
            )
          ])) : ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("view", {
            key: 1,
            class: "reminder-empty"
          }, [
            (0, import_vue.createElementVNode)("u-text", { class: "reminder-text" }, "\u5F53\u524D\u8868\u73B0\u4E0D\u9519\uFF0C\u7EE7\u7EED\u4FDD\u6301\uFF5E")
          ]))
        ]),
        (0, import_vue.createElementVNode)("view", { class: "bottom-area" }, [
          (0, import_vue.createElementVNode)("view", {
            class: "danger-btn",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.endSession && $options.endSession(...args))
          }, [
            (0, import_vue.createElementVNode)("u-text", { class: "danger-text" }, "\u7ED3\u675F\u4F5C\u4E1A")
          ])
        ])
      ])
    ]);
  }
  var doing = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "/Users/youyuzui/Desktop/2025-Code/88-YYZ/xiguan-yangcheng/xgzs/pages/session/doing.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/session/doing";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    doing.mpType = "page";
    const app = Vue.createPageApp(doing, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...doing.styles || []]));
    app.mount("#root");
  }
})();
