import { RobotRepositoryInterface } from '../../robot/interfaces/robot-interface'
import { MonitorsRepositoryInterface } from '../interfaces/monitorsRepository-interface'
import { IndexesTypesType } from './../../../dtos/dtos'
import { AppError } from './../../../helpers/errors/appError'

interface RequestRemoveMonitorInterface {
  id: string
  userId: string
}

export class RemoveMonitorUseCase {
  constructor (
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly robotRepository: RobotRepositoryInterface
  ) { }

  async execute ({ id, userId }: RequestRemoveMonitorInterface): Promise<void> {
    const alredyExists = await this.monitorsRepository.findById({ id, userId })

    if (!alredyExists) throw new AppError('This monitor not found!')

    if (alredyExists.isActive) throw new AppError('This monitor cannot be deleted, it is running!')

    if (alredyExists.indexes) {
      const indexes = alredyExists.indexes.split(',') as IndexesTypesType[]

      indexes.push('LAST_CANDLE')

      for (const index of indexes) {
        await this.robotRepository.deleteKeyOnRobotMemory({ userId, index, interval: alredyExists.interval ?? undefined, symbol: alredyExists.symbol })
      }
    }

    await this.monitorsRepository.delete({ id, userId })
  }
}
