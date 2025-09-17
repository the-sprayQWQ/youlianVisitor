import type { ICaptcha, IUpdateInfo, IUpdatePassword, IUserInfoVo } from './types/login'
import { http } from '@/http/http'

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string
  password: string
}

/**
 * 手机号登录表单
 */
export interface IPhoneLoginForm {
  phone: string
  password: string
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export function getCode() {
  return http.get<ICaptcha>('/user/getCode')
}

/**
 * 用户登录
 * @param loginForm 登录表单
 */
export function login(loginForm: ILoginForm) {
  return http.post<IUserInfoVo>('/sys/loginByXCX', loginForm)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get<IUserInfoVo>('/user/info')
}

/**
 * 退出登录
 */
export function logout() {
  return http.get<void>('/user/logout')
}

/**
 * 修改用户信息
 */
export function updateInfo(data: IUpdateInfo) {
  return http.post('/user/updateInfo', data)
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: IUpdatePassword) {
  return http.post('/user/updatePassword', data)
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}

/**
 * 微信登录参数
 */

/**
 * 微信登录
 * @param params 微信登录参数，包含code
 * @returns Promise 包含登录结果
 */
// <IUserInfoVo>
export function wxLogin(data: { code: string, phoneCode: string }) {
  return http.get<IUserInfoVo>('/wxLogin/login', data)
}

/**
 * 手机号登录
 */
export function phoneLogin(data: IPhoneLoginForm) {
  return http.post<IUserInfoVo>('/sys/loginByPhoneXCX', data)
}
