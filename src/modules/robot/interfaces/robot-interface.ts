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

export interface InputDeleteKeyOnRobotMemoryInterface {
  userId?: string
  symbol: string
  index: IndexesTypesType
  interval?: string
}

export interface InputGetKeyOnRobotMemoryInterface {
  userId?: string
  symbol: string
  index: IndexesTypesType
  interval?: string
}

export interface RobotRepositoryInterface {
  updateRobotMemory: (data: InputUpdateRobotMemoryInterface) => Promise<void>
  getAllRobotMemory: () => Promise<ConvertedInterface>
  deleteKeyOnRobotMemory: (data: InputDeleteKeyOnRobotMemoryInterface) => Promise<void>
  searchPatternOnRobotMemory: (pattern: string) => Promise<ConvertedInterface>
  getKeyOnRobotMemory: (data: InputGetKeyOnRobotMemoryInterface) => Promise<object>
  clearAllOnRobotMemory: () => Promise<void>
}
