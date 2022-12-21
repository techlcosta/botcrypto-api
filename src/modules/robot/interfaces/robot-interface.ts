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

export interface ConvertedInterface {
  [key: string]: object
}

export interface RobotRepositoryInterface {
  updateRobotMemory: (data: InputUpdateRobotMemoryInterface) => Promise<void>
  getAllRobotMemory: () => Promise<ConvertedInterface>
  searchPatternOnRobotMemory: (pattern: string) => Promise<ConvertedInterface>

}
