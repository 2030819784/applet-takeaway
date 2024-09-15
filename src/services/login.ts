import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'

type LoginParams = {
  code: string
  phoneCode: string
}
type PasswordParams = {
  phone: number
  password: string
}

/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (data: LoginParams) => {
  return http({
    method: 'POST',
    url: '/login/wechat',
    data,
  })
}
export const postPasswordAPI = (data: PasswordParams) => {
  return http({
    method: 'POST',
    url: '/backstageLogin/password',
    data,
  })
}

type LoginSimpleParams = {
  account: string
  password: string
}
/**
 * 小程序登录_测试版
 * @param data 测试登录参数
 */
export const postLoginSimpleAPI = (data: LoginSimpleParams) => {
  return http({
    method: 'POST',
    url: '/login',
    data,
  })
}
