/**
 * 添加拦截器:
 *   拦截 request 请求
 *   拦截 uploadFile 文件上传
 *
 * TODO:
 *   1. 非 http 开头需拼接地址
 *   2. 请求超时
 *   3. 添加小程序端请求头标识
 *   4. 添加 token 请求头标识
 */

import { useLoginStore, useMemberStore } from '@/stores'

const baseURL = 'http://localhost:8081'
const loginStore = useLoginStore()
// 添加拦截器
const httpInterceptor = {
	// 拦截前触发
	invoke(options: UniApp.RequestOptions) {
		// 1. 非 http 开头需拼接地址
		if (!options.url.startsWith('http')) {
			options.url = baseURL + options.url
		}
		// 2. 请求超时, 默认 60s
		options.timeout = 5000
		// 3. 添加小程序端请求头标识
		options.header = {
			...options.header,
			'source-client': 'miniapp',
			authorization: uni.getStorageSync('token') ? uni.getStorageSync('token') : '',
		}
	},
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */

export const http = async (options: any) => {
	return new Promise((resolve, reject) => {
		uni.request({
			...options,
			// 响应成功
			success(res: any) {
				if (res.header.authorization) {
					uni.setStorageSync('token', res.header.authorization)
					loginStore.token = res.header.authorization
				}
				if (res.data.code?.toString().slice(0, 4) == '1101' || !uni.getStorageSync('user')) {
					uni.showToast({ icon: 'error', title: '请前往登录' })
					uni.navigateTo({
						url: '/pages/login/login',
					})
				}
				resolve(res.data)
			},
			// 响应失败
			fail(err: any) {
				uni.showToast({
					icon: 'error',
					title: '网络错误',
				})
				reject(err)
			},
		})
	})
}
