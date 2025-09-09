import type { DepartmentNameList } from './types/sys'
import { http } from '@/http/http'

/**
 * 获取系统内所有部门
 */
export function getAllDepartment() {
  return http.get<IResData<string[]>>('/sys/sysDepart/queryAllDepartmentNameList')
}
