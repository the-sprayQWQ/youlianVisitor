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
  ylfkCheckApplicationPage: YlfkCheckApplicationPage
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
  ylfkApplicationUserList: YlfkApplicationUserList[]
}

export interface YlfkApplicationUserList {
  name?: string
  phone?: string
  cardType?: string
  idCard?: string
  visitorNumber?: string
  applicationStatus?: string
  carNumber?: string
  enterTime?: string
  leaveTime?: string
}
export interface YlfkCheckApplicationPage {
  deptName: string
  user: string
  idCard: string
  phone: string
  belongDept: string
  allUsers: string
  isCar: string
  carCode: string
  checkHaveGoodsList: CheckHaveGoods[]
  checkUsersList: CheckUsers[]
}

export interface CheckHaveGoods {
  toolName: string
  num: string
  isLeave: string
}

export interface CheckUsers {
  name: string
  cardCode: string
  phone: string
  insurance: string
}

/**
 * 提交申请单
 */
export function submitApplication(application: ISubmitApplication) {
  return http.post('/application/apply', application)
}
