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
    const roleType = ref()
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
     * 获取角色
     * @param roleId 角色ID
     * @returns
     */

    const getRoleInfo = async (roleId: string) => {
      const res = await getRoleById(roleId)
      console.log('角色信息', res)
      roleType.value = res.result.records[0]?.roles_dictText
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
      getRoleInfo(res.result.userInfo.roles)
      if (roleType.value === '门卫') {
        uni.switchTab({ url: '/pages/doorKeeperApproval/doorKeeperApproval' })
      }
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
      getRoleInfo(res.result.userInfo.roles)
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
      getRoleInfo(res.result.userInfo.roles)
    }

    return {
      userInfo,
      roleType,
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
