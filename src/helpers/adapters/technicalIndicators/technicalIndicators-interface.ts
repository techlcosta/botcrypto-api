
export interface InputCalcRSIInterface {
  values: number[]
  period?: number
}

export interface OutputCalRSIInterface {
  current: number
  previous: number
}

export interface InpuCalcMACDInterface {
  fastPeriod?: number
  slowPeriod?: number
  signalPeriod?: number
  SimpleMAOscillator?: boolean
  SimpleMASignal?: boolean
  values: number[]
}

export interface OutputCalMACDInterface {
  current: object
  previous: object
}

export interface TechnicalIndicatorsAdapterInterface {
  rsiCalc: (data: InputCalcRSIInterface) => Promise<OutputCalRSIInterface>
  macdCalc: (data: InpuCalcMACDInterface) => Promise<OutputCalMACDInterface>
}
