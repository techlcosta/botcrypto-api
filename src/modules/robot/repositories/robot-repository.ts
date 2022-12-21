import { IndexesTypesType } from '../../../dtos/dtos'
import { ConvertedInterface, InputUpdateRobotMemoryInterface, RobotRepositoryInterface } from '../interfaces/robot-interface'
import { redis } from './../../../redis'

interface MemoryKeyFactory {
  userId?: string
  symbol: string
  index: IndexesTypesType
  interval?: string
}

export class RobotRepository implements RobotRepositoryInterface {
  private async memoryKeyFactory ({ userId, symbol, index, interval }: MemoryKeyFactory): Promise<string> {
    if (!userId && interval) return `${symbol}:${index}_${interval}`
    if (userId && !interval) return `${symbol}:${index}@${userId}`
    if (userId && interval) return `${symbol}:${index}_${interval}@${userId}`

    return `${symbol}:${index}`
  }

  async updateRobotMemory (data: InputUpdateRobotMemoryInterface): Promise<void> {
    const { value, ...rest } = data

    const key = await this.memoryKeyFactory({ ...rest })

    await redis.set(key, JSON.stringify(value))
  }

  async getAllRobotMemory (): Promise<ConvertedInterface> {
    const keys = await redis.keys('*')

    let converted = {} as ConvertedInterface

    for (const key of keys) {
      const value = await redis.get(key)

      if (value) {
        converted = { ...converted, [key]: JSON.parse(value) }
      }
    }

    return converted
  }

  async searchPatternOnRobotMemory (pattern: string): Promise<ConvertedInterface> {
    const keys = await redis.keys(pattern)

    let converted = {} as ConvertedInterface

    for (const key of keys) {
      const value = await redis.get(key)

      if (value) {
        converted = { ...converted, [key]: JSON.parse(value) }
      }
    }

    return converted
  }
}
