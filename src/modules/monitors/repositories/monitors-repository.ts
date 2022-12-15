import { AppError } from '../../../helpers/errors/appError'
import { prisma } from '../../../prisma'
import { InputCountMonitorsInterface, InputCreateMonitorInterface, InputDeleteMonitorInterface, InputFindMonitorByIdInterface, InputFindMonitorByUserIdInterface, InputGetMonitorsInterface, InputUpdateMonitorInterface, MonitorInterface, MonitorsRepositoryInterface } from './../interfaces/monitors-interface'

interface MonitorAlredyExistsInterface {
  userId: string
  type: string
  symbol: string
  interval?: string
}

export class MonitorsRepository implements MonitorsRepositoryInterface {
  private async monitorAlredyExists (data: MonitorAlredyExistsInterface): Promise<MonitorInterface | null> {
    const monitor = await prisma.monitor.findFirst({
      where: {
        userId: data.userId,
        type: data.type,
        symbol: data.symbol,
        interval: data.interval
      }
    })

    return monitor
  }

  async create (data: InputCreateMonitorInterface): Promise<MonitorInterface> {
    const alredyExists = await this.monitorAlredyExists({
      userId: data.userId,
      type: data.type,
      symbol: data.symbol,
      interval: data.interval
    })

    if (alredyExists) throw new AppError('This monitor alredy exists!')

    const monitor = await prisma.monitor.create({
      data
    })

    return monitor
  }

  async update (data: InputUpdateMonitorInterface): Promise<MonitorInterface> {
    const { id, ...rest } = data

    const monitor = await prisma.monitor.update({
      where: {
        id
      },
      data: { ...rest }
    })

    return monitor
  }

  async delete (data: InputDeleteMonitorInterface): Promise<void> {
    const monitor = await this.findById({ id: data.id, userId: data.userId })

    if (monitor?.isSystemMonitor === true) throw new AppError('This monitor is system monitor!')

    if (!monitor) throw new AppError('Monitor not found!')

    await prisma.monitor.delete({
      where: {
        id: monitor.id
      }
    })
  }

  async findById (data: InputFindMonitorByIdInterface): Promise<MonitorInterface | null> {
    const monitor = await prisma.monitor.findFirst({
      where: {
        userId: data.userId,
        id: data.id
      }
    })

    return monitor
  }

  async findByUserId (data: InputFindMonitorByUserIdInterface): Promise<MonitorInterface[] > {
    const monitor = await prisma.monitor.findMany({
      where: {
        userId: data.userId
      }
    })

    return monitor
  }

  async getActiveMonitors (): Promise<MonitorInterface[] | null> {
    const monitors = await prisma.monitor.findMany({
      where: {
        isActive: true
      }
    })

    return monitors
  }

  async count ({ symbol, userId }: InputCountMonitorsInterface): Promise<number> {
    const countNumber = await prisma.monitor.count({
      where: {
        userId,
        symbol: {
          contains: symbol
        }
      }
    })

    return countNumber
  }

  async get (data: InputGetMonitorsInterface): Promise<MonitorInterface[]> {
    const take = 10

    const { userId, page, symbol } = data

    const orders = await prisma.monitor.findMany({
      where: {
        userId,
        symbol: {
          contains: symbol
        }
      },
      take,
      skip: take * ((page) - 1),
      orderBy: [
        { isActive: 'desc' },
        { isSystemMonitor: 'desc' },
        { symbol: 'desc' }
      ]
    })

    return orders
  }
}
