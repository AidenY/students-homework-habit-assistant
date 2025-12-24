<script>
	import { init as initPhotoStorage } from '@/common/photoStorage.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			// #ifdef APP-PLUS
			// 初始化照片存储数据库
			initPhotoStorage().catch(err => {
				console.error('照片存储初始化失败', err)
			})
			
			// 申请存储权限（Android）
			this.requestStoragePermission()
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * 申请存储权限
			 */
			requestStoragePermission() {
				// #ifdef APP-PLUS
				try {
					// Android 6.0+ 需要动态申请存储权限
					const permissions = [
						'android.permission.READ_EXTERNAL_STORAGE',
						'android.permission.WRITE_EXTERNAL_STORAGE'
					]
					
					plus.android.requestPermissions(
						permissions,
						(resultObj) => {
							const readGranted = resultObj.granted && resultObj.granted.includes('android.permission.READ_EXTERNAL_STORAGE')
							const writeGranted = resultObj.granted && resultObj.granted.includes('android.permission.WRITE_EXTERNAL_STORAGE')
							
							if (readGranted && writeGranted) {
								console.log('存储权限已授予')
							} else {
								console.warn('存储权限未完全授予', resultObj)
								// 如果权限被拒绝，提示用户
								if (resultObj.deniedPresent && resultObj.deniedPresent.length > 0) {
									setTimeout(() => {
										uni.showModal({
											title: '需要存储权限',
											content: '为了保存作业照片，需要授予存储权限。请在设置中手动开启。',
											showCancel: true,
											confirmText: '去设置',
											cancelText: '稍后',
											success: (res) => {
												if (res.confirm) {
													// 打开应用设置页面
													plus.runtime.openURL('app-settings:')
												}
											}
										})
									}, 1000)
								}
							}
						},
						(err) => {
							console.error('存储权限请求失败', err)
						}
					)
				} catch (e) {
					console.error('申请存储权限异常', e)
				}
				// #endif
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
