import { AppError } from '../../../helpers/errors/appError'
import { AutomationInterface, AutomationsRepositoryInterface, InputAutomationAlredyExistsInterface, InputCountAutomationsInterface, InputCreateAutomationInterface, InputGetAutomationsInterface, InputUpdateAutomationInterface } from '../interfaces/automationsRepository-interface'
import { prisma } from './../../../prisma'

export class AutomationsRepository implements AutomationsRepositoryInterface {
  async getActiveAutomations (): Promise<AutomationInterface[] | null> {
    const automations = await prisma.automation.findMany({
      where: {
        isActive: true
      }
    })

    return automations
  }

  async count ({ userId, symbol }: InputCountAutomationsInterface): Promise<number> {
    const countNumber = await prisma.automation.count({
      where: {
        userId,
        symbol: {
          contains: symbol
        }
      }
    })

    return countNumber
  }

  async get (data: InputGetAutomationsInterface): Promise<AutomationInterface[]> {
    const take = 10

    const { userId, page, symbol } = data

    const automations = await prisma.automation.findMany({
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
        { symbol: 'desc' }
      ]
    })

    return automations
  }

  async automationAlredyExists ({ symbol, name, userId }: InputAutomationAlredyExistsInterface): Promise<AutomationInterface | null> {
    const automation = await prisma.automation.findFirst({
      where: {
        userId,
        symbol,
        name
      }
    })

    return automation
  }

  async create ({ name, symbol, indexes, conditions, isActive, userId }: InputCreateAutomationInterface): Promise<AutomationInterface> {
    const alredyExists = await this.automationAlredyExists({ symbol, name, userId })

    if (alredyExists) throw new AppError('This automations alredy exists!')

    const automation = await prisma.automation.create({
      data: {
        name,
        symbol,
        indexes,
        conditions,
        isActive,
        userId
      }
    })

    return automation
  }

  async update ({ id, ...rest }: InputUpdateAutomationInterface): Promise<AutomationInterface> {
    const automation = await prisma.automation.update({
      where: {
        id
      },
      data: { ...rest }
    })

    return automation
  }
}
