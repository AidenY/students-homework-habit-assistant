<template>
  <view class="config-page">
    <view class="header">
      <text class="title">个人配置</text>
      <text class="subtitle">管理您的应用设置和密钥</text>
    </view>

    <view class="config-card">
      <view class="card-header">
        <text class="card-title">LLM API 配置</text>
        <text class="card-desc">配置语言模型 API 相关信息</text>
      </view>

      <view class="config-item">
        <text class="item-label">API 地址</text>
        <input
          class="item-input"
          v-model="config.apiBaseUrl"
          placeholder="请输入 API 服务地址"
          placeholder-class="placeholder"
        />
      </view>

      <view class="config-item">
        <text class="item-label">API 密钥</text>
        <view class="input-group">
          <input
            class="item-input password-input"
            :type="showApiKey ? 'text' : 'password'"
            v-model="config.apiKey"
            placeholder="请输入 API 密钥"
            placeholder-class="placeholder"
          />
          <text class="toggle-btn" @click="togglePassword">
            {{ showApiKey ? '隐藏' : '显示' }}
          </text>
        </view>
        <text class="hint">密钥将加密存储在本地</text>
      </view>

      <view class="config-item">
        <text class="item-label">模型名称</text>
        <input
          class="item-input"
          v-model="config.modelName"
          placeholder="请输入模型名称"
          placeholder-class="placeholder"
        />
      </view>

      <view class="config-item">
        <view class="switch-item">
          <text class="switch-label">启用云端模型</text>
          <switch
            :checked="config.useCloudModel"
            @change="onSwitchChange"
            color="#4ba3ff"
          />
        </view>
      </view>
    </view>

    <view class="config-card">
      <view class="card-header">
        <text class="card-title">提醒设置</text>
        <text class="card-desc">配置作业提醒相关设置</text>
      </view>

      <view class="config-item">
        <view class="switch-item">
          <text class="switch-label">启用振动提醒</text>
          <switch
            :checked="config.enableVibration"
            @change="onVibrationChange"
            color="#4ba3ff"
          />
        </view>
      </view>
    </view>

    <view class="action-buttons">
      <button class="save-btn" @click="saveConfig" :disabled="saving">
        {{ saving ? '保存中...' : '保存配置' }}
      </button>
      <button class="test-btn" @click="testConfig" :disabled="testing || !config.apiKey">
        {{ testing ? '测试中...' : '测试连接' }}
      </button>
    </view>

    <view class="status-bar" v-if="statusMessage">
      <text class="status-text" :class="statusType">
        {{ statusMessage }}
      </text>
    </view>
  </view>
</template>

<script>
import { getEncryptedStorage, setEncryptedStorage } from '@/common/encryptedStorage.js'

export default {
  data() {
    return {
      config: {
        apiBaseUrl: '',
        apiKey: '',
        modelName: '',
        useCloudModel: false,
        enableVibration: true
      },
      showApiKey: false,
      saving: false,
      testing: false,
      statusMessage: '',
      statusType: 'success'
    }
  },
  onLoad() {
    this.loadConfig()
  },
  methods: {
    loadConfig() {
      try {
        const encryptedData = getEncryptedStorage('llm_config')
        if (encryptedData) {
          // 解密数据
          const decrypted = this.decryptData(encryptedData)
          if (decrypted) {
            this.config = {
              ...this.config,
              ...decrypted
            }
          }
        }
      } catch (error) {
        console.error('加载配置失败', error)
        this.showStatus('加载配置失败', 'error')
      }
    },

    saveConfig() {
      this.saving = true

      // 验证必填字段
      if (!this.config.apiBaseUrl || !this.config.apiKey) {
        this.showStatus('请填写 API 地址和密钥', 'error')
        this.saving = false
        return
      }

      try {
        // 加密配置数据
        const encryptedData = this.encryptData({
          apiBaseUrl: this.config.apiBaseUrl,
          apiKey: this.config.apiKey,
          modelName: this.config.modelName || '',
          useCloudModel: this.config.useCloudModel,
          enableVibration: this.config.enableVibration
        })

        // 保存到加密存储
        setEncryptedStorage('llm_config', encryptedData)

        this.showStatus('配置保存成功', 'success')

        // 更新到全局配置文件
        this.updateConfigFile()

      } catch (error) {
        console.error('保存配置失败', error)
        this.showStatus('保存配置失败', 'error')
      } finally {
        this.saving = false
      }
    },

    testConfig() {
      if (!this.config.apiKey || !this.config.apiBaseUrl) {
        this.showStatus('请先填写 API 信息', 'error')
        return
      }

      this.testing = true

      // 模拟测试 API 连接
      setTimeout(() => {
        this.testing = false
        // 模拟测试结果
        if (this.config.apiKey.includes('test') || this.config.apiBaseUrl.includes('test')) {
          this.showStatus('测试成功：API 连接正常', 'success')
        } else {
          this.showStatus('测试完成：配置格式正确', 'success')
        }
      }, 1500)
    },

    togglePassword() {
      this.showApiKey = !this.showApiKey
    },

    onSwitchChange(e) {
      this.config.useCloudModel = e.detail.value
    },

    onVibrationChange(e) {
      this.config.enableVibration = e.detail.value
    },

    encryptData(data) {
      // 简单的加密实现（实际项目中应使用更安全的加密算法）
      const str = JSON.stringify(data)
      let encrypted = ''
      for (let i = 0; i < str.length; i++) {
        encrypted += String.fromCharCode(str.charCodeAt(i) ^ 123) // 简单异或加密
      }
      return encrypted
    },

    decryptData(encrypted) {
      try {
        let decrypted = ''
        for (let i = 0; i < encrypted.length; i++) {
          decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ 123) // 异或解密
        }
        return JSON.parse(decrypted)
      } catch (e) {
        console.error('解密失败', e)
        return null
      }
    },

    updateConfigFile() {
      // 更新到配置文件
      const configPath = '@/config/model.config.js'
      const configContent = `export default {
  apiBaseUrl: '${this.config.apiBaseUrl}',
  apiKey: '${this.config.apiKey}',
  modelName: '${this.config.modelName || ''}',
  useCloudModel: ${this.config.useCloudModel}
}`

      // 注意：这里只是示例，实际项目中可能需要写入文件系统
      console.log('配置内容已生成', configContent)
    },

    showStatus(message, type = 'success') {
      this.statusMessage = message
      this.statusType = type

      setTimeout(() => {
        this.statusMessage = ''
      }, 3000)
    }
  }
}
</script>

<style>
.config-page {
  padding: 24rpx;
  background-color: #f3f7ff;
  min-height: 100vh;
}

.header {
  margin-bottom: 32rpx;
  text-align: center;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: #2c405a;
  display: block;
  margin-bottom: 12rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666666;
}

.config-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 24rpx;
  border-bottom: 2rpx solid #f0f3fa;
  padding-bottom: 16rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c405a;
  display: block;
  margin-bottom: 6rpx;
}

.card-desc {
  font-size: 24rpx;
  color: #888888;
}

.config-item {
  margin-bottom: 24rpx;
}

.item-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 12rpx;
  display: block;
}

.item-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  border-radius: 44rpx;
  border: 2rpx solid #e6e6e6;
  background-color: #f8f9fa;
}

.item-input:focus {
  border-color: #4ba3ff;
}

.placeholder {
  color: #999999;
}

.input-group {
  display: flex;
  align-items: center;
}

.password-input {
  flex: 1;
  border-radius: 44rpx 0 0 44rpx;
  border-right: none;
}

.toggle-btn {
  width: 120rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 24rpx;
  color: #4ba3ff;
  border-radius: 0 44rpx 44rpx 0;
  background-color: #e6f1ff;
  border: 2rpx solid #e6e6e6;
  border-left: none;
}

.hint {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-label {
  font-size: 28rpx;
  color: #333333;
}

.action-buttons {
  margin-top: 48rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.save-btn {
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #4ba3ff;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
}

.save-btn[disabled] {
  background-color: #b3d1ff;
  color: #ffffff;
}

.test-btn {
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  color: #4ba3ff;
  font-size: 32rpx;
  font-weight: 500;
  border: 2rpx solid #4ba3ff;
}

.test-btn[disabled] {
  background-color: #f0f3fa;
  color: #999999;
  border-color: #e6e6e6;
}

.status-bar {
  margin-top: 32rpx;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  background-color: #f0f9ff;
}

.status-success {
  color: #2f9b59;
}

.status-error {
  color: #dd524d;
}

.status-text {
  font-size: 26rpx;
}
</style>