/**
 * 查询角色身份返回的接口信息
 */

export interface IRoleInfo {
  records: {
    roles_dictText: string
  }[]
}
/**
 * 查询预约记录返回的接口信息
 */
export interface IApplicationList {
  records: {
    id: string
    applicationCode: string
    user: string
    currentName: string
    createTime: string
    applicationType: string
    applicationTypeName: string
    applicationName: string
    currentRecordUser: string
    processType_dictText: string
  }[]
}

/**
 * 获取待审批/已审批的接口信息
 */
export interface IProcessList {
  records: {
    applicationCode: string
    applicationTypeName: string
    createTime: string
    idCard: string
    processType_dictText: string
    user: string
  }[]
}
