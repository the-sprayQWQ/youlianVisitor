import { http } from '@/http/http'

export interface IDepartment {
  departName: string
  id: string
}

export interface IUserList {
  id: string
  roleName: string

}
/**
 * 获取系统内所有部门
 */
export function getAllDepartment() {
  return http.get<IDepartment[]>('/sys/sysDepart/getDepartList')
}

/**
 * 获取字典数据
 */
export function getDictData(dictCode: string, key: string) {
  return http.get<any>(`/sys/dict/getDictText/${dictCode}/${key}`)
}

/**
 * 获取系统内所有用户
 */
export function getSysAllUserList() {
  return http.get('/sys/user/list')
}
