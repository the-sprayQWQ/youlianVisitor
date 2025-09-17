export interface VisitorType {
  label: string
  value: string
}

export interface Department {
  label: string
  value: string
}
export interface VehicleOption {
  label: string
  value: string
}

export interface Participant {
  name: string
  idCard: string
}

export interface FormData {
  applicant: string
  phone: string
  idCard: string
  dateRange: string
  company: string
  contactPerson: string
  contactPhone: string
  content: string
  hasVehicle: boolean
  licensePlate: string
  participants: Participant[]
}

export interface Approvals {
  manager: boolean
  leader: boolean
  guard: boolean
}
