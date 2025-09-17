import { http } from '@/http/http'

export interface IDepartment {
  departName: string
  id: string
}

export interface IUserList {
  records: {
    id: string
    realname: string
    roles_dictText: string
  }[]
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
  return http.get<IUserList>('/sys/user/list')
}

/**
 * 获取节点审批意见结果
 */
export function getApprovalResult(applicationCode: string) {
  return http.get('/processApplication/processApplication/listProcessNodeRecordByApplicationCode', applicationCode)
}
