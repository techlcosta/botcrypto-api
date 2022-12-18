import { IndexesTypesType } from './../../../dtos/dtos'

export interface InputUpdateRobotMemoryInterface {
  userId?: string
  symbol: string
  index: IndexesTypesType
  interval?: string
  value: any
}

export interface InputgetRobotMemoryInterface {
  symbol: string
}

export interface RobotRepositoryInterface {
  updateRobotMemory: (data: InputUpdateRobotMemoryInterface) => Promise<void>
  getRobotMemory: () => Promise<any>

}
