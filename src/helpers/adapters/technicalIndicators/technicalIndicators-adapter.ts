import { macd, rsi } from 'technicalindicators'
import { InpuCalcMACDInterface, InputCalcRSIInterface, OutputCalMACDInterface, OutputCalRSIInterface, TechnicalIndicatorsAdapterInterface } from './technicalIndicators-interface'

export class TechnicalIndicatorsAdapter implements TechnicalIndicatorsAdapterInterface {
  async rsiCalc ({ values, period }: InputCalcRSIInterface): Promise<OutputCalRSIInterface> {
    const result = rsi({ values, period: period ?? 14 })

    const converted: OutputCalRSIInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }

  async macdCalc (data: InpuCalcMACDInterface): Promise<OutputCalMACDInterface> {
    const result = macd({
      fastPeriod: 5,
      slowPeriod: 8,
      signalPeriod: 3,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
      values: data.values
    })

    const converted: OutputCalMACDInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }
}
