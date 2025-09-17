import { http } from '@/http/http'

/**
 * 获取系统内所有部门
 */
export function getAllDepartment() {
  return http.get<string[]>('/sys/sysDepart/queryAllDepartmentNameList')
}

/**
 * 获取字典数据
 */
export function getDictData(dictCode: string, key: string) {
  return http.get<any>(`/sys/dict/getDictText/${dictCode}/${key}`)
}
