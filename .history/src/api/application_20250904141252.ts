import { http } from '@/http/http'

/**
 * 申请表单
 */

export interface ISubmitApplication {
  applicationCode: string
  applicationType: string
  user: string
  transUser: string
  userOpinion: string
  applicationResult: string
  ylfkApplicationPage: YlfkApplicationPage
}
export interface YlfkApplicationPage {
  user: string
  phone: string
  idCard: string
  startTime: string
  endTime: string
  applicationDept: string
  visitorDept: string
  visitorUser: string
  visitorPhone: string
  remark: string
  joinUserNum: string
  isCard: string
  carCode: string
  isGoods: string
  carImage: string
  goodsImage: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  sysOrgCode: string
  ylfkApplicationUserList: YlfkApplicationUserList[]
}

export interface YlfkApplicationUserList {
  name?: string
  phone?: string
  cardType?: string
  idCard?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  visitorNumber?: string
  applicationStatus?: string
  carNumber?: string

  enterTime?: string

  leaveTime?: string
}

/**
 * 提交申请单
 */
export function submitApplication(application: ISubmitApplication) {
  return http.post('/application/apply', application)
}
