import type { IRoleInfo } from '@/api/types/role'
import { http } from '@/http/http'

/**
 * 根据id查询角色信息
 */

export function getRoleById(id: string) {
  return http.get<IRoleInfo>('/sys/user/userRoleList', { roleId: id })
}
