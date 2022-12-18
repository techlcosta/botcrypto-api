import { IndexesTypesType } from '../../../dtos/dtos'
import { InputUpdateRobotMemoryInterface, RobotRepositoryInterface } from '../interfaces/robot-interface'
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
    if (userId && !interval) return `${userId}-${symbol}:${index}`
    if (userId && interval) return `${userId}-${symbol}:${index}_${interval}`

    return `${symbol}:${index}`
  }

  async updateRobotMemory (data: InputUpdateRobotMemoryInterface): Promise<void> {
    const { value, ...rest } = data

    const key = await this.memoryKeyFactory({ ...rest })

    await redis.set(key, JSON.stringify(value))
  }

  async getRobotMemory (): Promise<any> {
    const keys = await redis.keys('*')

    const values = await redis.mget(...keys)

    const converted = values.map(value => value ? JSON.parse(value) : value)

    return converted
  }
}
