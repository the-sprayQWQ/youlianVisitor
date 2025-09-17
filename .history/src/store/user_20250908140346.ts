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
    username: '',
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
      uni.removeStorageSync('user')
    }

    /**
     * 获取角色
     * @param roleId 角色ID
     * @returns
     */
    const getRoleInfo = async (roleId: string) => {
      try {
        if (!roleId) {
          return
        }
        const res = await getRoleById(roleId)

        if (res && res.result && res.result.records && res.result.records.length > 0) {
          roleType.value = res.result.records[0]?.roles_dictText
        }
        else {
          console.warn('未获取到角色信息')
        }
      }
      catch (error) {
        console.error('获取角色信息失败:', error)
        toast.error('获取角色信息失败')
      }
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
      try {
        // 验证输入参数
        if (!credentials.username || !credentials.password) {
          toast.error('用户名和密码不能为空')
          return
        }

        const res = await _login(credentials)
        console.log('登录响应:', res)

        // 检查API响应
        if (!res) {
          toast.error('登录失败：服务器无响应')
          return
        }

        if (!res.result) {
          toast.error(`登录失败：${res.msg || '未知错误'}`)
          return
        }

        // 验证返回的数据结构
        if (!res.result.token) {
          console.warn('登录响应中缺少token')
        }

        toast.success('登录成功')
        setUserInfo(res.result)

        // 获取角色信息（异步，不阻塞登录流程）
        if (res.result.userInfo?.roles) {
          await getRoleInfo(res.result.userInfo.roles)
        }

        return res.result
      }
      catch (error) {
        console.error('登录失败:', error)
        toast.error('登录失败：网络错误或服务器异常')
        throw error
      }
    }

    /**
     * 手机号登录
     */
    const phoneLogin = async (phonesInfo: {
      phone: string
      password: string
    }) => {
      try {
        // 验证输入参数
        if (!phonesInfo.phone || !phonesInfo.password) {
          toast.error('手机号和密码不能为空')
          return
        }

        const res = await _phoneLogin(phonesInfo)
        console.log('手机号登录响应:', res)

        // 检查API响应
        if (!res || !res.result) {
          toast.error(`登录失败：${res?.msg || '服务器响应异常'}`)
          return
        }

        toast.success('登录成功')
        setUserInfo(res.result)

        // 获取角色信息
        if (res.result.userInfo?.roles) {
          await getRoleInfo(res.result.userInfo.roles)
        }

        return res.result
      }
      catch (error) {
        console.error('手机号登录失败:', error)
        toast.error('登录失败：网络错误或服务器异常')
        throw error
      }
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      try {
        console.log('退出登录...')
      }
      catch (error) {
        console.error('退出登录失败:', error)
      }
      finally {
        // 无论API调用是否成功，都清除本地数据
        userInfo.value = { ...userInfoState }
        roleType.value = undefined
        removeUserInfo()
      }
    }

    /**
     * 微信登录
     */
    const wxLogin = async () => {
      try {
        // 获取微信小程序登录的code
        const data = await getWxCode()
        console.log()
        if (!data?.code) {
          toast.error('获取微信授权码失败')
          return
        }

        const res = await _wxLogin({ code: data.code })
        console.log('微信登录响应:', res)

        if (!res || !res.result) {
          toast.error(`微信登录失败：${res?.msg || '服务器响应异常'}`)
          return
        }

        setUserInfo(res.result)

        // 获取角色信息
        if (res.result.userInfo?.roles) {
          await getRoleInfo(res.result.userInfo.roles)
        }

        return res.result
      }
      catch (error) {
        console.error('微信登录失败:', error)
        toast.error('微信登录失败：网络错误或服务器异常')
        throw error
      }
    }

    return {
      userInfo,
      roleType,
      login,
      wxLogin,
      logout,
      removeUserInfo,
      phoneLogin,
    }
  },
  {
    persist: true,
  },
)
