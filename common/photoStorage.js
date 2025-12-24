// 照片存储服务 - 使用 SQLite
// Android 和 iOS 都支持 SQLite，uni-app 提供了 plus.sqlite API

const DB_NAME = 'homework_photos.db'
const TABLE_NAME = 'photos'

let db = null

/**
 * 初始化数据库
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    try {
      // 检查数据库是否已经打开
      if (db) {
        console.log('SQLite 数据库已经打开，直接使用')
        // 确保表已创建
        createTable().then(resolve).catch(reject)
        return
      }
      
      // 打开数据库（如果不存在会自动创建）
      plus.sqlite.openDatabase({
        name: DB_NAME,
        path: '_doc/' + DB_NAME, // 存储在应用文档目录
        success: () => {
          console.log('SQLite 数据库打开成功')
          // 标记数据库已打开
          db = true
          // 创建表
          createTable().then(resolve).catch(reject)
        },
        fail: (err) => {
          // 如果是因为数据库已经打开而失败，尝试关闭后重新打开
          if (err.code === -1402 || (err.message && err.message.includes('Already Open'))) {
            console.log('数据库已打开，尝试关闭后重新打开')
            try {
              // 先关闭
              plus.sqlite.closeDatabase({
                name: DB_NAME,
                success: () => {
                  console.log('已关闭旧数据库连接，重新打开')
                  // 重新打开
                  plus.sqlite.openDatabase({
                    name: DB_NAME,
                    path: '_doc/' + DB_NAME,
                    success: () => {
                      console.log('SQLite 数据库重新打开成功')
                      db = true
                      createTable().then(resolve).catch(reject)
                    },
                    fail: (err2) => {
                      console.error('SQLite 数据库重新打开失败', err2)
                      reject(err2)
                    }
                  })
                },
                fail: (closeErr) => {
                  console.log('关闭数据库失败，尝试直接打开', closeErr)
                  // 如果关闭失败，可能数据库实际上已经打开了，直接尝试创建表
                  db = true
                  createTable().then(resolve).catch((tableErr) => {
                    // 如果创建表失败，再尝试重新打开
                    console.log('创建表失败，尝试重新打开数据库', tableErr)
                    plus.sqlite.openDatabase({
                      name: DB_NAME,
                      path: '_doc/' + DB_NAME,
                      success: () => {
                        console.log('SQLite 数据库打开成功（关闭失败后的重试）')
                        db = true
                        createTable().then(resolve).catch(reject)
                      },
                      fail: (err3) => {
                        console.error('SQLite 数据库打开失败（重试）', err3)
                        reject(err3)
                      }
                    })
                  })
                }
              })
            } catch (e) {
              console.error('处理数据库打开异常', e)
              reject(e)
            }
          } else {
            console.error('SQLite 数据库打开失败', err)
            reject(err)
          }
        }
      })
    } catch (e) {
      console.error('初始化 SQLite 异常', e)
      reject(e)
    }
    // #endif
    
    // #ifndef APP-PLUS
    // H5 环境：使用 localStorage 作为降级方案
    console.log('非 App 环境，使用 localStorage 存储照片信息')
    resolve()
    // #endif
  })
}

/**
 * 创建照片表
 */
function createTable() {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    // 先删除旧表（如果存在），然后重新创建，确保表结构正确
    const dropSql = `DROP TABLE IF EXISTS ${TABLE_NAME}`
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
    `
    
    try {
      // 先删除旧表
      plus.sqlite.executeSql({
        name: DB_NAME,
        sql: dropSql,
        success: () => {
          console.log('旧表已删除（如果存在）')
          // 创建新表
          plus.sqlite.executeSql({
            name: DB_NAME,
            sql: createSql,
            success: () => {
              console.log('照片表创建成功')
              // 标记数据库已初始化
              db = true
              resolve()
            },
            fail: (err) => {
              console.error('照片表创建失败', err)
              reject(err)
            }
          })
        },
        fail: (err) => {
          console.warn('删除旧表失败（可能表不存在）', err)
          // 即使删除失败，也尝试创建表
          plus.sqlite.executeSql({
            name: DB_NAME,
            sql: createSql,
            success: () => {
              console.log('照片表创建成功（删除失败后）')
              db = true
              resolve()
            },
            fail: (err2) => {
              console.error('照片表创建失败', err2)
              reject(err2)
            }
          })
        }
      })
    } catch (e) {
      console.error('执行创建表 SQL 异常', e)
      reject(e)
    }
    // #endif
    
    // #ifndef APP-PLUS
    resolve()
    // #endif
  })
}

/**
 * 保存照片信息
 * @param {string} sessionId - 会话ID
 * @param {string} photoPath - 照片路径
 * @param {number} timestamp - 时间戳
 * @param {number} elapsedTime - 已用时间（毫秒）
 * @param {string} elapsedText - 已用时间文本
 */
export function savePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    // 确保数据库已初始化
    if (!db) {
      initDatabase()
        .then(() => {
          _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText)
            .then(resolve)
            .catch(reject)
        })
        .catch((err) => {
          console.error('初始化数据库失败，照片信息将仅保存在内存中', err)
          // 即使数据库失败，也 resolve，因为照片已经在内存中了
          resolve()
        })
      return
    }
    
    _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText)
      .then(resolve)
      .catch((err) => {
        console.error('保存照片到数据库失败，但照片已在内存中', err)
        // 即使数据库保存失败，也 resolve，因为照片已经在内存中了
        resolve()
      })
    // #endif
    
    // #ifndef APP-PLUS
    // H5 环境：使用 localStorage
    try {
      const key = `photo_${sessionId}_${timestamp}`
      const photoData = {
        sessionId,
        photoPath,
        timestamp,
        elapsedTime,
        elapsedText
      }
      localStorage.setItem(key, JSON.stringify(photoData))
      resolve()
    } catch (e) {
      reject(e)
    }
    // #endif
  })
}

/**
 * 实际执行保存照片
 */
function _doSavePhoto(sessionId, photoPath, timestamp, elapsedTime, elapsedText) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    // 确保所有必填字段都有值
    // 注意：photoPath 可能是空字符串，需要检查
    if (!sessionId || !photoPath || photoPath.trim() === '' || !timestamp || elapsedTime === undefined || elapsedTime === null) {
      const error = new Error('保存照片失败：必填字段缺失')
      console.error('保存照片参数检查失败', {
        sessionId: sessionId || 'undefined',
        photoPath: photoPath || 'undefined',
        timestamp: timestamp || 'undefined',
        elapsedTime: elapsedTime,
        elapsedText: elapsedText || 'undefined'
      })
      reject(error)
      return
    }
    
    const sql = `
      INSERT INTO ${TABLE_NAME} (session_id, photo_path, timestamp, elapsed_time, elapsed_text)
      VALUES (?, ?, ?, ?, ?)
    `
    
    // 确保 elapsedText 不为 null（如果为空则使用空字符串）
    const safeElapsedText = elapsedText || ''
    
    // 确保所有参数都不为 null/undefined
    const safeSessionId = String(sessionId || '')
    const safePhotoPath = String(photoPath || '')
    const safeTimestamp = Number(timestamp || 0)
    const safeElapsedTime = Number(elapsedTime || 0)
    const safeElapsedTextFinal = String(safeElapsedText || '')
    
    // 再次验证必填字段
    if (!safeSessionId || safeSessionId === 'undefined' || safeSessionId === 'null') {
      const error = new Error('sessionId 无效: ' + sessionId)
      console.error('sessionId 验证失败', { sessionId, safeSessionId })
      reject(error)
      return
    }
    
    if (!safePhotoPath || safePhotoPath === 'undefined' || safePhotoPath === 'null') {
      const error = new Error('photoPath 无效: ' + photoPath)
      console.error('photoPath 验证失败', { photoPath, safePhotoPath })
      reject(error)
      return
    }
    
    // 转义 SQL 字符串中的单引号
    const escapeSqlString = (str) => {
      if (!str) return ''
      return String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')
    }
    
    // uni-app 的 plus.sqlite.executeSql 可能不支持 args 参数
    // 使用直接 SQL 拼接（已转义，相对安全）
    const directSql = `
      INSERT INTO ${TABLE_NAME} (session_id, photo_path, timestamp, elapsed_time, elapsed_text)
      VALUES ('${escapeSqlString(safeSessionId)}', '${escapeSqlString(safePhotoPath)}', ${safeTimestamp}, ${safeElapsedTime}, '${escapeSqlString(safeElapsedTextFinal)}')
    `
    
    console.log('准备保存照片到数据库', {
      sessionId: safeSessionId,
      sessionIdLength: safeSessionId ? safeSessionId.length : 0,
      photoPath: safePhotoPath.substring(0, 50) + '...',
      timestamp: safeTimestamp,
      elapsedTime: safeElapsedTime,
      elapsedText: safeElapsedTextFinal,
      sqlPreview: directSql.substring(0, 150) + '...'
    })
    
    plus.sqlite.executeSql({
      name: DB_NAME,
      sql: directSql,
      success: () => {
        console.log('照片保存成功', { sessionId: safeSessionId, timestamp: safeTimestamp })
        resolve()
      },
      fail: (err) => {
        console.error('照片保存失败', err)
        console.error('保存参数详情', {
          sessionId: safeSessionId,
          sessionIdType: typeof safeSessionId,
          sessionIdValue: safeSessionId,
          sessionIdLength: safeSessionId ? safeSessionId.length : 0,
          photoPath: safePhotoPath.substring(0, 50),
          timestamp: safeTimestamp,
          elapsedTime: safeElapsedTime,
          elapsedText: safeElapsedTextFinal,
          sql: directSql
        })
        reject(err)
      }
    })
    // #endif
  })
}

/**
 * 获取会话的所有照片
 * @param {string} sessionId - 会话ID
 */
export function getPhotosBySession(sessionId) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    if (!db) {
      initDatabase()
        .then(() => {
          _doGetPhotos(sessionId).then(resolve).catch(reject)
        })
        .catch(reject)
      return
    }
    
    _doGetPhotos(sessionId).then(resolve).catch(reject)
    // #endif
    
    // #ifndef APP-PLUS
    // H5 环境：从 localStorage 读取
    try {
      const photos = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`photo_${sessionId}_`)) {
          const photoData = JSON.parse(localStorage.getItem(key))
          photos.push({
            path: photoData.photoPath,
            timestamp: photoData.timestamp,
            elapsedTime: photoData.elapsedTime,
            elapsedText: photoData.elapsedText
          })
        }
      }
      // 按时间戳排序
      photos.sort((a, b) => a.timestamp - b.timestamp)
      resolve(photos)
    } catch (e) {
      reject(e)
    }
    // #endif
  })
}

/**
 * 实际执行查询照片
 */
function _doGetPhotos(sessionId) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    // 转义 SQL 字符串中的单引号
    const escapeSqlString = (str) => {
      if (!str) return ''
      return String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')
    }
    
    // 使用直接 SQL 拼接（已转义）
    const safeSessionId = String(sessionId || '').replace(/'/g, "''")
    const sql = `
      SELECT photo_path, timestamp, elapsed_time, elapsed_text
      FROM ${TABLE_NAME}
      WHERE session_id = '${safeSessionId}'
      ORDER BY timestamp ASC
    `
    
    console.log('查询照片 SQL', sql.substring(0, 150))
    
    plus.sqlite.selectSql({
      name: DB_NAME,
      sql: sql,
      success: (result) => {
        console.log('查询结果', result)
        const photos = result.map(row => ({
          path: row.photo_path,
          timestamp: row.timestamp,
          elapsedTime: row.elapsed_time,
          elapsedText: row.elapsed_text
        }))
        console.log(`查询到 ${photos.length} 张照片`, { sessionId, photos: photos.map(p => p.path.substring(0, 30)) })
        resolve(photos)
      },
      fail: (err) => {
        console.error('查询照片失败', err)
        console.error('查询参数', { sessionId, sql: sql.substring(0, 200) })
        reject(err)
      }
    })
    // #endif
  })
}

/**
 * 删除会话的所有照片
 * @param {string} sessionId - 会话ID
 */
export function deletePhotosBySession(sessionId) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    if (!db) {
      resolve()
      return
    }
    
    const sql = `DELETE FROM ${TABLE_NAME} WHERE session_id = ?`
    
    plus.sqlite.executeSql({
      name: DB_NAME,
      sql: sql,
      args: [sessionId],
      success: () => {
        console.log('照片删除成功', { sessionId })
        resolve()
      },
      fail: (err) => {
        console.error('照片删除失败', err)
        reject(err)
      }
    })
    // #endif
    
    // #ifndef APP-PLUS
    // H5 环境：从 localStorage 删除
    try {
      const keysToDelete = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`photo_${sessionId}_`)) {
          keysToDelete.push(key)
        }
      }
      keysToDelete.forEach(key => localStorage.removeItem(key))
      resolve()
    } catch (e) {
      reject(e)
    }
    // #endif
  })
}

/**
 * 初始化（在应用启动时调用）
 */
export function init() {
  return initDatabase()
}

