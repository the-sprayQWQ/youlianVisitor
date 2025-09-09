import { http } from '@/http/http'

/**
 * 获取系统内所有部门
 */
export function getAllDepartment() {
  return http.get<string[]>('/sys/sysDepart/queryAllDepartmentNameList')
}
