import { StochasticRSIOutput } from 'technicalindicators/declarations/momentum/StochasticRSI'
import { MACDOutput } from 'technicalindicators/declarations/moving_averages/MACD'
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands'

export interface InputCalcRSIInterface {
  values: number[]
  period?: number
}

export interface OutputCalcRSIInterface {
  current: number
  previous: number
}

export interface InputCalcMACDInterface {
  fastPeriod?: number
  slowPeriod?: number
  signalPeriod?: number
  SimpleMAOscillator?: boolean
  SimpleMASignal?: boolean
  values: number[]
}

export interface OutputCalcMACDInterface {
  current: MACDOutput
  previous: MACDOutput
}

export interface InputCalcStochasticRSIInterface {
  values: number[]
  rsiPeriod: number
  stochasticPeriod: number
  kPeriod: number
  dPeriod: number
}

export interface OutputCalcStochasticRSIInterface {
  current: StochasticRSIOutput
  previous: StochasticRSIOutput
}

export interface InputCalcBollingerBandsInterface {
  period: number
  stdDev: number
  values: number[]
}

export interface OutputCalcBollingerBandsInterface {
  current: BollingerBandsOutput
  previous: BollingerBandsOutput
}

export interface InputCalcSMAInterface {
  period: number
  values: number[]
}

export interface OutputCalcSMAInterface {
  current: number
  previous: number
}

export interface InputCalcEMAInterface {
  period: number
  values: number[]
}

export interface OutputCalcEMAInterface {
  current: number
  previous: number
}

export interface TechnicalIndicatorsAdapterInterface {
  rsiCalc: (data: InputCalcRSIInterface) => Promise<OutputCalcRSIInterface>
  macdCalc: (data: InputCalcMACDInterface) => Promise<OutputCalcMACDInterface>
  stochRSICalc: (data: InputCalcStochasticRSIInterface) => Promise<OutputCalcStochasticRSIInterface>
  bollingerBandsCalc: (data: InputCalcBollingerBandsInterface) => Promise<OutputCalcBollingerBandsInterface>
  smaCalc: (data: InputCalcSMAInterface) => Promise<OutputCalcSMAInterface>
  emaCalc: (data: InputCalcEMAInterface) => Promise<OutputCalcEMAInterface>
}
