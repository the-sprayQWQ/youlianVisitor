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
  applicationCode?: string,
  applicationDate?: string,
  applicationType?: string,
) {
  return http.get<IApplicationList>(
    '/processApplication/processApplication/listVisitor',
    {
      pageNo,
      pageSize,
      createBy,
      applicationCode,
      applicationDate,
      applicationType,
    },
  )
}

/**
 * 获取预约记录详情
 */
export function getYlfkApplicationDetail(
  applicationCode: string,
  applicationType: string,
) {
  return http.get<any>(
    '/visitor/ylfkApplication/queryAllApplicationListByApplicationCode',
    { applicationCode, applicationType },
  )
}

/**
 * 获取待审批与已审批列表
 */
export function getYlfkProcessApplication(
  pageNo: number,
  pageSize: number,
  recordStatus: string,
  currentRecordUser: string,
  applicationStatus?: string,
  idCard?: string,
  user?: string,
  applicationDate?: string,
  applicationCode?: string,
  applicationType?: string,
) {
  return http.get<IProcessList>(
    '/processApplication/processApplication/listApproval',
    {
      pageNo,
      pageSize,
      recordStatus,
      currentRecordUser,
      applicationStatus,
      applicationDate,
      applicationCode,
      applicationType,
    },
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
 * 获取在厂访客列表
 */
export function getInVisitorList(pageNo: number, pageSize: number) {
  return http.get<IProcessList>(
    '/visitor/ylfkApplication/queryYlfkApplicationUser',
    {
      pageNo,
      pageSize,
      applicationStatus: '3',
    },
  )
}

/**
 * 发起离场申请
 */
export function submitLeaveApplication(user: string, applicationCode: string) {
  return http.get('/application/leaveFactory', { user, applicationCode })
}

/**
 * 扫码登记
 */
export function scanRegister(phone: string, applyId: string) {
  return http.post('/application/QrCodeVerification', {
    phone,
    applicationCode: applyId,
  })
}

/**
 * 回收临时访客号和车牌
 */
export function recycleInfo(
  applicationCode: string,
  name: string,
  idCard: string,
) {
  return http.post('/application/recycleTemporaryInfo', {
    applicationCode,
    name,
    idCard,
  })
}
