export interface AutomationInterface {
  id: string
  symbol: string
  name: string
  isActive: boolean
  showLogs: boolean
  conditions: string
  indexes: string
  userId: string
  updatedAt: Date
  createdAt: Date
}

export interface InputCountAutomationsInterface {
  userId: string
  symbol?: string
}

export interface InputGetAutomationsInterface {
  userId: string
  symbol?: string
  page: number
}

export interface InputAutomationAlredyExistsInterface {
  symbol: string
  name: string
  userId: string
}

export interface InputCreateAutomationInterface {
  symbol: string
  name: string
  isActive: boolean
  conditions: string
  indexes: string
  userId: string
}

export interface InputUpdateAutomationInterface {
  id: string
  symbol?: string
  name?: string
  isActive?: boolean
  showLogs?: boolean
  conditions?: string
  indexes?: string
}

export interface AutomationsRepositoryInterface {
  count: (data: InputCountAutomationsInterface) => Promise<number>
  getActiveAutomations: () => Promise<AutomationInterface[] | null>
  automationAlredyExists: (data: InputAutomationAlredyExistsInterface) => Promise<AutomationInterface | null>
  get: (data: InputGetAutomationsInterface) => Promise<AutomationInterface[]>
  create: (data: InputCreateAutomationInterface) => Promise<AutomationInterface>
  update: (data: InputUpdateAutomationInterface) => Promise<AutomationInterface>

}
