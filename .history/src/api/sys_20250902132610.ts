import type { IDepartmentName } from './types/sys'
import { http } from '@/http/http'

/**
 * 获取系统内所有部门
 */
export function getAllDepartment() {
  return http.get<IDepartmentName>('/sys/sysDepart/queryAllDepartmentNameList')
}
