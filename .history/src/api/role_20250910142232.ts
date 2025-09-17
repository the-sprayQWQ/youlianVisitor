import type {
  IApplicationList,
  IProcessList,
  IRoleInfo,
} from '@/api/types/role'
import { http } from '@/http/http'

export interface IForm {
  user: string
  applicationCode: string
  applicationType?: string
  transUser?: string
  copyUser?: string
  userOpinion?: string
  applicationResult?: string
  visitorNumber?: string
  carNumber?: string
}

/**
 * 根据id查询角色信息
 */

export function getRoleById(id: string) {
  return http.get<IRoleInfo>('/sys/user/userRoleList', { roleId: id })
}

/***
 * 获取当前用户的预约记录
 */
export function getYlfkApplicationList(
  pageNo: number,
  pageSize: number,
  createBy: string,
) {
  return http.get<IApplicationList>(
    '/processApplication/processApplication/listVisitor',
    { pageNo, pageSize, createBy },
  )
}

/**
 * 获取预约记录详情
 */
export function getYlfkApplicationDetail(
  applicationCode: string,
  applicationType: string,
) {
  return http.get(
    '/visitor/ylfkApplication/queryAllApplicationListByApplicationCode',
    { applicationCode, applicationType },
  )
}

/**
 * 获取待审批与已审批列表
 */
export function getYlfkProcessApplication(
  recordStatus: string,
  currentRecordUser: string,
) {
  return http.get<IProcessList>(
    '/processApplication/processApplication/listApproval',
    { pageNo: 1, pageSize: 10, recordStatus, currentRecordUser },
  )
}

/**
 * 进行审批
 */
export function toApprovalApplication(form: IForm) {
  return http.post('/application/record', {
    user: form.user,
    applicationCode: form.applicationCode,
    applicationType: form.applicationType,
    transUser: form.transUser,
    copyUser: form.copyUser,
    userOpinion: form.userOpinion,
    applicationResult: form.applicationResult,
    visitorNumber: form.visitorNumber,
    carNumber: form.carNumber,
  })
}

/**
 * 获取门卫
 */
