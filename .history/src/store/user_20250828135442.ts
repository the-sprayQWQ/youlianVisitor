import type { IUserInfoVo } from '@/api/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo as _getUserInfo,
  login as _login,
  logout as _logout,
  phoneLogin as _phoneLogin,
  wxLogin as _wxLogin,
  getWxCode,
} from '@/api/login'
import { getRoleById } from '@/api/role'
import { toast } from '@/utils/toast'

// 初始化状态
const userInfoState: IUserInfoVo = {
  message: '',
  sysAllDictItems: {},
  token: '',
  userInfo: {
    openId: '',
    id: '',
    roles: '',
  },
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfoVo>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: IUserInfoVo) => {
      console.log('设置用户信息', val)
      userInfo.value = val
    }
    // 删除用户信息
    const removeUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('userInfo')
    }
    /**
     * 用户登录
     * @param credentials 登录参数
     * @returns R<IUserInfoVo>
     */
    const login = async (credentials: {
      username: string
      password: string
    }) => {
      const res = await _login(credentials)
      console.log('登录信息', res)
      toast.success('登录成功')
      setUserInfo(res.result)
      getRoleById(res.result.userInfo.roles)
      return res
    }
    /**
     * 获取角色
     * @param roleId 角色ID
     * @returns
     */
    const getRoleInfo = async (roleId: string) => {
      const res = await getRoleById(roleId)
      console.log('角色信息', res)
      return res
    }

    /**
     * 手机号登录
     */
    const phoneLogin = async (phonesInfo: {
      phone: string
      password: string
    }) => {
      const res = await _phoneLogin(phonesInfo)
      console.log('登录信息', res)
      toast.success('登录成功')
      return res
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      removeUserInfo()
    }
    /**
     * 微信登录
     */
    const wxLogin = async () => {
      // 获取微信小程序登录的code
      const data = await getWxCode()
      const res = await _wxLogin({ code: data.code })
      console.log(data.code, 'code')
      // setUserInfo(res.result)
      setUserInfo(res.result)
      return res
    }

    return {
      userInfo,
      login,
      wxLogin,
      logout,
      phoneLogin,
    }
  },
  {
    persist: true,
  },
)
