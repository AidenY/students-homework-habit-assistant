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
class CameraService {
  constructor() {
    this.videoStream = null;
    this.videoElement = null;
    this.devicePosition = "front";
    this.isRunning = false;
    this.onErrorCallback = null;
    this.onReadyCallback = null;
  }
  /**
   * 初始化摄像头
   * @param {Object} options
   * @param {String} options.devicePosition - 'front' | 'back'
   * @param {Function} options.onReady - 准备就绪回调
   * @param {Function} options.onError - 错误回调
   * @param {HTMLElement|String} options.videoElement - video 元素或选择器
   */
  async init(options = {}) {
    const { devicePosition = "front", onReady, onError, videoElement } = options;
    this.devicePosition = devicePosition;
    this.onReadyCallback = onReady;
    this.onErrorCallback = onError;
    this.videoElement = videoElement;
    return this.initApp();
  }
  /**
   * H5 环境初始化（使用 getUserMedia）
   */
  async initH5() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("浏览器不支持 getUserMedia API");
      }
      const facingMode = this.devicePosition === "front" ? "user" : "environment";
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      this.videoStream = stream;
      this.isRunning = true;
      if (this.videoElement) {
        const videoEl = typeof this.videoElement === "string" ? document.querySelector(this.videoElement) : this.videoElement;
        if (videoEl) {
          if (videoEl.srcObject !== void 0) {
            videoEl.srcObject = stream;
          } else if (videoEl.setAttribute) {
            videoEl.setAttribute("src", URL.createObjectURL(stream));
          }
          await videoEl.play();
        }
      }
      if (this.onReadyCallback) {
        this.onReadyCallback();
      }
      return { success: true, message: "摄像头启动成功" };
    } catch (error) {
      this.isRunning = false;
      formatAppLog("error", "at common/cameraService.js:99", "H5 摄像头初始化失败:", error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
      return { success: false, error: error.message };
    }
  }
  /**
   * App 环境初始化（使用 camera 组件）
   * 注意：nvue 中 camera 组件需要手动管理，这里只返回状态
   */
  initApp() {
    this.isRunning = true;
    if (this.onReadyCallback) {
      setTimeout(() => {
        this.onReadyCallback();
      }, 500);
    }
    return { success: true, message: "App 摄像头组件已准备" };
  }
  /**
   * 切换摄像头
   */
  async switchCamera() {
    this.devicePosition = this.devicePosition === "front" ? "back" : "front";
    return { success: true, message: "请通过页面组件切换摄像头" };
  }
  /**
   * 停止摄像头
   */
  stop() {
    this.isRunning = false;
  }
  /**
   * 获取当前设备位置
   */
  getDevicePosition() {
    return this.devicePosition;
  }
  /**
   * 检查是否正在运行
   */
  isActive() {
    return this.isRunning;
  }
}
const cameraService = new CameraService();
const _style_0 = { "page": { "": { "flex": 1, "backgroundColor": "#f3f7ff", "paddingLeft": "16rpx", "paddingRight": "16rpx", "paddingTop": "16rpx", "paddingBottom": "140rpx" } }, "top-card": { "": { "backgroundColor": "#ffffff", "borderRadius": "24rpx", "paddingTop": "20rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "16rpx" } }, "time-row": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "12rpx" } }, "time-block": { "": { "flex": 1 } }, "time-label": { "": { "fontSize": "24rpx", "color": "#555555" } }, "time-value": { "": { "fontSize": "34rpx", "fontWeight": "600", "color": "#2c405a", "marginTop": "4rpx" } }, "progress-bar": { "": { "height": "14rpx", "borderRadius": "7rpx", "backgroundColor": "#f0f3fa", "overflow": "hidden" } }, "progress-inner": { "": { "height": "14rpx", "borderRadius": "7rpx", "backgroundColor": "#4ba3ff" } }, "camera-card": { "": { "marginTop": "12rpx", "marginBottom": "16rpx", "borderRadius": "24rpx", "backgroundColor": "#ffffff", "overflow": "hidden" } }, "camera-view-wrapper": { "": { "width": "750rpx", "height": "520rpx", "position": "relative", "backgroundColor": "#000000" } }, "camera-view": { "": { "width": "750rpx", "height": "520rpx", "backgroundColor": "#000000" } }, "camera-placeholder": { "": { "position": "absolute", "top": 0, "left": 0, "width": "750rpx", "height": "520rpx", "backgroundColor": "#1a1a1a", "alignItems": "center", "justifyContent": "center", "flexDirection": "column", "zIndex": 1 } }, "placeholder-text": { "": { "fontSize": "32rpx", "color": "#ffffff", "marginBottom": "12rpx" } }, "placeholder-subtitle": { "": { "fontSize": "24rpx", "color": "#999999" } }, "camera-overlay": { "": { "paddingTop": "16rpx", "paddingRight": "20rpx", "paddingBottom": "18rpx", "paddingLeft": "20rpx" } }, "camera-title": { "": { "fontSize": "30rpx", "fontWeight": "600", "color": "#2c405a", "marginBottom": "6rpx" } }, "camera-subtitle": { "": { "fontSize": "24rpx", "color": "#555555" } }, "switch-row": { "": { "marginTop": "10rpx" } }, "camera-tip": { "": { "fontSize": "22rpx", "color": "#888888", "marginBottom": "6rpx" } }, "switch-btn": { "": { "alignSelf": "flex-start", "paddingLeft": "22rpx", "paddingRight": "22rpx", "paddingTop": "8rpx", "paddingBottom": "8rpx", "borderRadius": "32rpx", "backgroundColor": "#e6f1ff" } }, "switch-text": { "": { "fontSize": "24rpx", "color": "#2f80ff" } }, "debug-panel": { "": { "marginTop": "12rpx", "paddingTop": "12rpx", "paddingRight": "12rpx", "paddingBottom": "12rpx", "paddingLeft": "12rpx", "backgroundColor": "#fff3cd", "borderRadius": "8rpx", "borderWidth": "1rpx", "borderColor": "#ffc107" } }, "debug-title": { "": { "fontSize": "26rpx", "fontWeight": "600", "color": "#856404", "marginBottom": "8rpx" } }, "debug-item": { "": { "fontSize": "22rpx", "color": "#856404", "marginBottom": "4rpx", "lines": 3 } }, "debug-error": { "": { "color": "#dc3545" } }, "debug-btn-row": { "": { "flexDirection": "row", "marginTop": "8rpx", "justifyContent": "space-between" } }, "debug-btn": { "": { "flex": 1, "marginRight": "8rpx", "paddingTop": "6rpx", "paddingRight": "12rpx", "paddingBottom": "6rpx", "paddingLeft": "12rpx", "backgroundColor": "#ffc107", "borderRadius": "6rpx", "alignItems": "center", "justifyContent": "center", "marginRight:last-child": 0 } }, "debug-btn-text": { "": { "fontSize": "22rpx", "color": "#856404" } }, "debug-toggle": { "": { "marginTop": "8rpx", "alignItems": "center" } }, "debug-toggle-btn": { "": { "paddingTop": "6rpx", "paddingRight": "16rpx", "paddingBottom": "6rpx", "paddingLeft": "16rpx", "backgroundColor": "#e6f1ff", "borderRadius": "6rpx" } }, "debug-toggle-text": { "": { "fontSize": "22rpx", "color": "#2f80ff" } }, "status-row": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "8rpx" } }, "status-card": { "": { "flex": 1, "marginRight": "8rpx", "borderRadius": "20rpx", "paddingTop": "14rpx", "paddingRight": "16rpx", "paddingBottom": "14rpx", "paddingLeft": "16rpx", "backgroundColor": "#f5f7fb", "marginRight:last-child": 0 } }, "status-label": { "": { "fontSize": "24rpx", "color": "#555555" } }, "status-value": { "": { "fontSize": "28rpx", "fontWeight": "600", "marginTop": "4rpx" }, ".status-good ": { "color": "#2f9b59" }, ".status-focus ": { "color": "#2f9b59" }, ".status-bend ": { "color": "#f0ad4e" }, ".status-distract ": { "color": "#f0ad4e" }, ".status-idle ": { "color": "#f0ad4e" }, ".status-lie ": { "color": "#dd524d" }, ".status-leave ": { "color": "#dd524d" } }, "encourage": { "": { "marginTop": "4rpx", "marginBottom": "8rpx" } }, "encourage-text": { "": { "fontSize": "26rpx", "color": "#2f9b59" } }, "reminder-card": { "": { "borderRadius": "24rpx", "backgroundColor": "#ffffff", "paddingTop": "18rpx", "paddingRight": "20rpx", "paddingBottom": "20rpx", "paddingLeft": "20rpx", "marginBottom": "8rpx" } }, "reminder-header": { "": { "flexDirection": "row", "justifyContent": "space-between", "marginBottom": "8rpx" } }, "reminder-title": { "": { "fontSize": "28rpx", "fontWeight": "600", "color": "#2c405a" } }, "reminder-count": { "": { "fontSize": "24rpx", "color": "#555555" } }, "reminder-content": { "": { "flexDirection": "row", "alignItems": "center" } }, "reminder-icon": { "": { "fontSize": "30rpx", "marginRight": "6rpx" } }, "reminder-text": { "": { "fontSize": "26rpx", "color": "#3f536e" } }, "reminder-empty": { "": { "fontSize": "26rpx", "color": "#3f536e" } }, "bottom-area": { "": { "position": "fixed", "left": 0, "right": 0, "bottom": "40rpx", "paddingLeft": "32rpx", "paddingRight": "32rpx" } }, "danger-btn": { "": { "height": "88rpx", "borderRadius": "44rpx", "backgroundColor": "#ff6b6b", "alignItems": "center", "justifyContent": "center" } }, "danger-text": { "": { "fontSize": "32rpx", "color": "#ffffff" } } };
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
      cameraReady: false,
      initTimeout: null,
      permissionGranted: false,
      useVideoStream: false
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
  },
  mounted() {
    formatAppLog("log", "at pages/session/doing.nvue:231", "doing page mounted");
  },
  onShow() {
    this.startTime = this.startTime || Date.now();
    this.startTimers();
    this.startDetection();
    this.requestCameraPermission();
  },
  onHide() {
    this.clearTimers();
    stopMockLoop();
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
      this.initTimeout = null;
    }
    this.stopCamera();
  },
  beforeDestroy() {
    this.clearTimers();
    stopMockLoop();
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
      this.initTimeout = null;
    }
    this.stopCamera();
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
    async switchCamera() {
      await cameraService.switchCamera();
      this.devicePosition = cameraService.getDevicePosition();
      this.cameraStatus = `正在切换到${this.devicePosition === "front" ? "前置" : "后置"}摄像头...`;
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
        reminders: this.reminders
      };
      uni.navigateTo({
        url: "/pages/session/report",
        success: (res) => {
          res.eventChannel && res.eventChannel.emit("sessionFinished", payload);
        }
      });
    },
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
              formatAppLog("log", "at pages/session/doing.nvue:372", "nvue 摄像头权限已授予", resultObj);
              setTimeout(() => {
                this.startCamera();
              }, 300);
            } else {
              this.permissionStatus = "被拒绝";
              this.permissionGranted = false;
              formatAppLog("log", "at pages/session/doing.nvue:381", "nvue 摄像头权限被拒绝", resultObj);
            }
          },
          (err) => {
            this.permissionStatus = "请求失败: " + JSON.stringify(err);
            this.permissionGranted = false;
            formatAppLog("log", "at pages/session/doing.nvue:387", "nvue 摄像头权限请求失败: " + JSON.stringify(err));
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
        formatAppLog("log", "at pages/session/doing.nvue:398", "nvue 摄像头权限请求异常: " + e);
      }
    },
    /**
     * 启动摄像头（统一接口）
     */
    async startCamera() {
      if (!this.permissionGranted) {
        formatAppLog("log", "at pages/session/doing.nvue:407", "权限未授予，等待权限授予后再启动摄像头");
        return;
      }
      this.cameraStatus = "正在启动摄像头...";
      setTimeout(() => {
        if (!this.cameraReady) {
          this.cameraReady = true;
          this.cameraStatus = "摄像头组件已显示（如画面仍为黑屏，可能是硬件限制）";
          formatAppLog("log", "at pages/session/doing.nvue:454", "App camera 组件已显示，等待画面加载");
        }
      }, 2e3);
      if (this.initTimeout) {
        clearTimeout(this.initTimeout);
      }
      this.initTimeout = setTimeout(() => {
        if (!this.cameraReady) {
          this.cameraStatus = "摄像头初始化超时。nvue camera 组件可能存在问题，但其他功能（Mock 检测、评分、报告）可正常使用";
          formatAppLog("log", "at pages/session/doing.nvue:465", "摄像头初始化超时，但继续运行其他功能");
          if (!this.showDebugInfo) {
            this.showDebugInfo = true;
          }
        }
      }, 5e3);
      setTimeout(() => {
        this.checkCameraStatus();
      }, 1e3);
    },
    // 保留旧方法名以兼容（已废弃，使用 startCamera）
    async startVideoStream() {
    },
    /**
     * 停止摄像头（统一接口）
     */
    stopCamera() {
      this.cameraReady = false;
    },
    // 保留旧方法名以兼容（已废弃，使用 stopCamera）
    stopVideoStream() {
      this.stopCamera();
    },
    onVideoError(e) {
    },
    onVideoPlay(e) {
    },
    toggleDebugInfo() {
      this.showDebugInfo = !this.showDebugInfo;
    },
    // camera 组件会自动处理，这里只做状态检查
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
        if (this.cameraReady) {
          this.cameraStatus = `摄像头已初始化完成 (设备支持: ${hasCamera ? "是" : "否"}, 数量: ${cameraCount})`;
        } else {
          this.cameraStatus = `等待 camera 组件初始化... (设备支持: ${hasCamera ? "是" : "否"}, 数量: ${cameraCount}, 权限: ${granted ? "已授予" : "未授予"})`;
          if (granted && hasCamera && cameraCount > 0) {
            formatAppLog("log", "at pages/session/doing.nvue:627", "权限和设备都正常，但 camera 组件未初始化，可能是调试基座限制");
          }
        }
      } catch (e) {
        this.cameraStatus = "检查失败: " + e.toString();
        formatAppLog("log", "at pages/session/doing.nvue:632", "检查摄像头状态失败", e);
      }
    },
    onScanCode(e) {
      formatAppLog("log", "at pages/session/doing.nvue:637", "scan code", e);
    },
    onCameraStop(e) {
      formatAppLog("log", "at pages/session/doing.nvue:640", "camera stop", e);
      this.cameraStatus = "摄像头已停止";
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
            createElementVNode("u-text", { class: "time-value" }, toDisplayString($options.elapsedText), 1)
          ]),
          createElementVNode("view", { class: "time-block" }, [
            createElementVNode("u-text", { class: "time-label" }, "预计"),
            createElementVNode("u-text", { class: "time-value" }, toDisplayString($options.expectedText), 1)
          ])
        ]),
        createElementVNode("view", { class: "progress-bar" }, [
          createElementVNode("view", {
            class: "progress-inner",
            style: normalizeStyle({ width: $options.progressPercent + "%" })
          }, null, 4)
        ])
      ]),
      createElementVNode("view", { class: "camera-card" }, [
        createElementVNode("view", { class: "camera-view-wrapper" }, [
          $data.permissionGranted ? (openBlock(), createElementBlock("camera", {
            key: 0,
            id: "camera",
            class: "camera-view",
            mode: "normal",
            devicePosition: $data.devicePosition,
            flash: "off",
            frameSize: "medium",
            enableMetadata: false,
            onError: _cache[0] || (_cache[0] = (...args) => _ctx.onCameraError && _ctx.onCameraError(...args)),
            onInitdone: _cache[1] || (_cache[1] = (...args) => _ctx.onCameraInitDone && _ctx.onCameraInitDone(...args)),
            onStop: _cache[2] || (_cache[2] = (...args) => $options.onCameraStop && $options.onCameraStop(...args)),
            onScancode: _cache[3] || (_cache[3] = (...args) => $options.onScanCode && $options.onScanCode(...args))
          }, null, 40, ["devicePosition"])) : createCommentVNode("", true),
          !$data.permissionGranted ? (openBlock(), createElementBlock("view", {
            key: 1,
            class: "camera-placeholder"
          }, [
            createElementVNode("u-text", { class: "placeholder-text" }, "摄像头预览区域"),
            createElementVNode("u-text", { class: "placeholder-subtitle" }, "权限授予后将显示实时画面")
          ])) : createCommentVNode("", true)
        ]),
        createElementVNode("view", { class: "camera-overlay" }, [
          createElementVNode("u-text", { class: "camera-title" }, "实时摄像头预览"),
          createElementVNode("u-text", { class: "camera-subtitle" }, " 当前使用：" + toDisplayString($data.devicePosition === "front" ? "前置摄像头" : "后置摄像头"), 1),
          createElementVNode("view", { class: "switch-row" }, [
            createElementVNode("u-text", { class: "camera-tip" }, "保持脸部出现在画面中间，更容易识别姿态～"),
            createElementVNode("view", {
              class: "switch-btn",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.switchCamera && $options.switchCamera(...args))
            }, [
              createElementVNode("u-text", { class: "switch-text" }, " 切换为" + toDisplayString($data.devicePosition === "front" ? "后置" : "前置") + "摄像头 ", 1)
            ])
          ])
        ]),
        $data.showDebugInfo ? (openBlock(), createElementBlock("view", {
          key: 0,
          class: "debug-panel"
        }, [
          createElementVNode("u-text", { class: "debug-title" }, "调试信息"),
          createElementVNode("u-text", { class: "debug-item" }, "权限状态: " + toDisplayString($data.permissionStatus), 1),
          createElementVNode("u-text", { class: "debug-item" }, "摄像头状态: " + toDisplayString($data.cameraStatus), 1),
          $data.cameraError ? (openBlock(), createElementBlock("u-text", {
            key: 0,
            class: "debug-item debug-error"
          }, "错误信息: " + toDisplayString($data.cameraError), 1)) : createCommentVNode("", true),
          $data.cameraErrorDetail ? (openBlock(), createElementBlock("u-text", {
            key: 1,
            class: "debug-item debug-error"
          }, "错误详情: " + toDisplayString($data.cameraErrorDetail), 1)) : createCommentVNode("", true),
          createElementVNode("view", { class: "debug-btn-row" }, [
            createElementVNode("view", {
              class: "debug-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.toggleDebugInfo && $options.toggleDebugInfo(...args))
            }, [
              createElementVNode("u-text", { class: "debug-btn-text" }, "隐藏调试")
            ]),
            createElementVNode("view", {
              class: "debug-btn",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.checkCameraStatus && $options.checkCameraStatus(...args))
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
            onClick: _cache[7] || (_cache[7] = (...args) => $options.toggleDebugInfo && $options.toggleDebugInfo(...args))
          }, [
            createElementVNode("u-text", { class: "debug-toggle-text" }, "显示调试信息")
          ])
        ]))
      ]),
      createElementVNode("view", { class: "status-row" }, [
        createElementVNode("view", {
          class: normalizeClass(["status-card", "status-" + $data.postureState])
        }, [
          createElementVNode("u-text", { class: "status-label" }, "坐姿"),
          createElementVNode("u-text", { class: "status-value" }, toDisplayString($options.postureLabel), 1)
        ], 2),
        createElementVNode("view", {
          class: normalizeClass(["status-card", "status-" + $data.focusState])
        }, [
          createElementVNode("u-text", { class: "status-label" }, "专注"),
          createElementVNode("u-text", { class: "status-value" }, toDisplayString($options.focusLabel), 1)
        ], 2),
        createElementVNode("view", {
          class: normalizeClass(["status-card", "status-" + $data.taskState])
        }, [
          createElementVNode("u-text", { class: "status-label" }, "状态"),
          createElementVNode("u-text", { class: "status-value" }, toDisplayString($options.taskLabel), 1)
        ], 2)
      ]),
      $options.encourageText ? (openBlock(), createElementBlock("view", {
        key: 0,
        class: "encourage"
      }, [
        createElementVNode("u-text", { class: "encourage-text" }, toDisplayString($options.encourageText), 1)
      ])) : createCommentVNode("", true),
      createElementVNode("view", { class: "reminder-card" }, [
        createElementVNode("view", { class: "reminder-header" }, [
          createElementVNode("u-text", { class: "reminder-title" }, "最近提醒"),
          createElementVNode("u-text", { class: "reminder-count" }, "共 " + toDisplayString($data.reminderCount) + " 次", 1)
        ]),
        $data.lastReminderText ? (openBlock(), createElementBlock("view", {
          key: 0,
          class: "reminder-content",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.replayLastReminder && $options.replayLastReminder(...args))
        }, [
          createElementVNode("u-text", { class: "reminder-icon" }, "🔔"),
          createElementVNode("u-text", { class: "reminder-text" }, toDisplayString($data.lastReminderText), 1)
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
          onClick: _cache[9] || (_cache[9] = (...args) => $options.endSession && $options.endSession(...args))
        }, [
          createElementVNode("u-text", { class: "danger-text" }, "结束作业")
        ])
      ])
    ])
  ]);
}
const doing = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export {
  doing as default
};
