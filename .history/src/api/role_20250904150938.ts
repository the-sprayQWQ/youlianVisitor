import type { IApplicationList, IRoleInfo } from '@/api/types/role'
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
export function getYlfkApplicationList(pageNo: number, pageSize: number, createBy: string) {
  return http.get<IApplicationList>('/processApplication/processApplication/listVisitor', { pageNo, pageSize, createBy })
}

/**
 * 获取预约记录详情
 */
export function getYlfkApplicationDetail(applicationCode: string, applicationType: string) {
  return http.get('/visitor/ylfkApplication/queryAllApplicationListByApplicationCode', { applicationCode, applicationType })
}
