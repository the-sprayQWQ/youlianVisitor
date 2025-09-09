import { http } from '@/http/http'

/**
 * 申请表单
 */

export interface ISubmitApplication {
  applicationType: string
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

/**
 * 提交申请单
 */
export function submitApplication(application: ISubmitApplication) {
  return http.post('/application/apply', application)
}
