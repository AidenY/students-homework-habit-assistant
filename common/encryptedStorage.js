/**
 * 加密存储服务
 * 用于安全存储敏感信息，如 API 密钥等
 */

// 加密密钥（实际项目中应该从更安全的地方获取）
const SECRET_KEY = 'homework_assistant_2024'

// 简单的异或加密函数
function xorEncrypt(str, key) {
  let encrypted = ''
  for (let i = 0; i < str.length; i++) {
    encrypted += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return encrypted
}

// 简单的异或解密函数
function xorDecrypt(encrypted, key) {
  let decrypted = ''
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return decrypted
}

// Base64 编码
function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

// Base64 解码
function base64Decode(str) {
  return decodeURIComponent(escape(atob(str)))
}

/**
 * 设置加密数据
 * @param {string} key - 存储键名
 * @param {any} data - 要存储的数据
 * @param {string} [secretKey] - 自定义加密密钥（可选）
 */
export function setEncryptedStorage(key, data, secretKey = SECRET_KEY) {
  try {
    // 序列化数据
    const jsonStr = JSON.stringify(data)

    // 加密数据
    const encrypted = xorEncrypt(jsonStr, secretKey)

    // Base64 编码
    const encoded = base64Encode(encrypted)

    // 存储到本地
    uni.setStorageSync(`encrypted_${key}`, encoded)

    return true
  } catch (error) {
    console.error('加密存储失败:', error)
    return false
  }
}

/**
 * 获取加密数据
 * @param {string} key - 存储键名
 * @param {string} [secretKey] - 自定义加密密钥（可选）
 * @returns {any|null} 解密后的数据，失败返回 null
 */
export function getEncryptedStorage(key, secretKey = SECRET_KEY) {
  try {
    // 从本地获取
    const encoded = uni.getStorageSync(`encrypted_${key}`)

    if (!encoded) {
      return null
    }

    // Base64 解码
    const encrypted = base64Decode(encoded)

    // 解密数据
    const jsonStr = xorDecrypt(encrypted, secretKey)

    // 解析 JSON
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('解密存储失败:', error)
    return null
  }
}

/**
 * 删除加密数据
 * @param {string} key - 存储键名
 * @returns {boolean} 是否删除成功
 */
export function removeEncryptedStorage(key) {
  try {
    uni.removeStorageSync(`encrypted_${key}`)
    return true
  } catch (error) {
    console.error('删除加密存储失败:', error)
    return false
  }
}

/**
 * 检查加密数据是否存在
 * @param {string} key - 存储键名
 * @returns {boolean} 是否存在
 */
export function hasEncryptedStorage(key) {
  try {
    const encoded = uni.getStorageSync(`encrypted_${key}`)
    return !!encoded
  } catch (error) {
    console.error('检查加密存储失败:', error)
    return false
  }
}

/**
 * 清空所有加密数据
 * @returns {boolean} 是否清空成功
 */
export function clearEncryptedStorage() {
  try {
    const keys = uni.getStorageInfoSync().keys
    let success = true

    keys.forEach(key => {
      if (key.startsWith('encrypted_')) {
        if (!removeEncryptedStorage(key.replace('encrypted_', ''))) {
          success = false
        }
      }
    })

    return success
  } catch (error) {
    console.error('清空加密存储失败:', error)
    return false
  }
}

/**
 * 获取存储信息
 * @returns {Object} 存储信息对象
 */
export function getStorageInfo() {
  try {
    return uni.getStorageInfoSync()
  } catch (error) {
    console.error('获取存储信息失败:', error)
    return {
      keys: [],
      currentSize: 0,
      limitSize: 0
    }
  }
}

/**
 * 使用更安全的加密算法（示例）
 * 实际项目中应该使用更强大的加密算法如 AES
 */
export function secureEncrypt(data, secretKey = SECRET_KEY) {
  try {
    // 生成随机盐值
    const salt = generateSalt()

    // 使用 PBKDF2 或其他密钥派生函数（这里简化处理）
    const derivedKey = deriveKey(secretKey, salt)

    // 加密数据
    const encrypted = xorEncrypt(JSON.stringify(data), derivedKey)

    // 组合盐值和加密数据
    return salt + ':' + encrypted
  } catch (error) {
    console.error('安全加密失败:', error)
    throw error
  }
}

export function secureDecrypt(encryptedData, secretKey = SECRET_KEY) {
  try {
    // 分离盐值和加密数据
    const [salt, encrypted] = encryptedData.split(':')

    // 派生密钥
    const derivedKey = deriveKey(secretKey, salt)

    // 解密数据
    const decrypted = xorDecrypt(encrypted, derivedKey)

    return JSON.parse(decrypted)
  } catch (error) {
    console.error('安全解密失败:', error)
    throw error
  }
}

// 辅助函数：生成随机盐值
function generateSalt() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let salt = ''
  for (let i = 0; i < 16; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return salt
}

// 辅助函数：派生密钥（简化版）
function deriveKey(secret, salt) {
  return secret + salt // 实际项目中应该使用更复杂的密钥派生函数
}