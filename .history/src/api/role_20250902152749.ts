import type { IRoleInfo } from '@/api/types/role'
import { http } from '@/http/http'

/**
 * 根据id查询角色信息
 */

export function getRoleById(id: string) {
  return http.get<IRoleInfo>('/sys/user/userRoleList', { roleId: id })
}

/***
 * 获取当前用户的预约记录
 */
export function getYlfkApplicationList(createBy: string) {
  return http.get('/visitor/ylfkApplication/listByCondition', { pageNo: 1, pageSize: 10, createBy })
}
