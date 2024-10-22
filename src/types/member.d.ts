import { type } from 'os'

/** 通用的用户信息 */
type BaseProfile = {
  /** 用户ID */
  id: number
  /** 头像  */
  avatar: string
  /** 账户名  */
  account: string
  /** 昵称 */
  nickname?: string
  /** 类型 */
  type: number
}

/** 小程序登录 登录用户信息 */
export type LoginResult = BaseProfile & {
  /** 手机号 */
  mobile: string
  /** 登录凭证 */
  token: string
}

/** 个人信息 用户详情信息 实名认证信息*/
export type ProfileDetail = BaseProfile & {
  /** 证件类型 */
  idType?: string
  /** 受检者姓名*/
  username?: string
  /** 证件号码*/
  idNumber?: string
  /** 生日 */
  birthday?: string
  /** 手机号 */
  mobile: string
  /** 性别 */
  gender?: Gender
  /** 年龄*/
  age?: number
  /** 职业 */
  profession?: string
  /** 地址*/
  address?: string
}
/** 性别 */
export type Gender = '女' | '男'

/** 个人信息 修改请求体参数 */
export type ProfileParams = Pick<
  ProfileDetail,
  'nickname' | 'gender' | 'birthday' | 'profession'
> & {
  /** 省份编码 */
  provinceCode?: string
  /** 城市编码 */
  cityCode?: string
  /** 区/县编码 */
  countyCode?: string
}
