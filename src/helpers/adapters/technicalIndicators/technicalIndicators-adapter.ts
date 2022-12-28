import { bollingerbands, ema, macd, rsi, sma, stochasticrsi } from 'technicalindicators'
import {
  InputCalcBollingerBandsInterface,
  InputCalcEMAInterface,
  InputCalcMACDInterface,
  InputCalcRSIInterface,
  InputCalcSMAInterface,
  InputCalcStochasticRSIInterface,
  OutputCalcBollingerBandsInterface,
  OutputCalcEMAInterface,
  OutputCalcMACDInterface,
  OutputCalcRSIInterface,
  OutputCalcSMAInterface,
  OutputCalcStochasticRSIInterface,
  TechnicalIndicatorsAdapterInterface
} from './technicalIndicators-interface'

export class TechnicalIndicatorsAdapter implements TechnicalIndicatorsAdapterInterface {
  async rsiCalc ({ values, period }: InputCalcRSIInterface): Promise<OutputCalcRSIInterface> {
    const result = rsi({ values, period: period ?? 14 })

    const converted: OutputCalcRSIInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }

  async macdCalc ({ fastPeriod = 12, slowPeriod = 26, signalPeriod = 9, SimpleMAOscillator = false, SimpleMASignal = false, values }: InputCalcMACDInterface): Promise<OutputCalcMACDInterface> {
    const result = macd({
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator,
      SimpleMASignal,
      values
    })

    const converted: OutputCalcMACDInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }

  async stochRSICalc ({ values, rsiPeriod = 14, stochasticPeriod = 14, kPeriod = 3, dPeriod = 3 }: InputCalcStochasticRSIInterface): Promise<OutputCalcStochasticRSIInterface> {
    const result = stochasticrsi({
      values,
      rsiPeriod,
      stochasticPeriod,
      kPeriod,
      dPeriod
    })

    const converted: OutputCalcStochasticRSIInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }

  async bollingerBandsCalc ({ period = 20, stdDev = 2, values }: InputCalcBollingerBandsInterface): Promise<OutputCalcBollingerBandsInterface> {
    const result = bollingerbands({
      period,
      stdDev,
      values
    })

    const converted: OutputCalcBollingerBandsInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }

  async smaCalc ({ period = 10, values }: InputCalcSMAInterface): Promise<OutputCalcSMAInterface> {
    const result = sma({
      period,
      values
    })

    const converted: OutputCalcSMAInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }

  async emaCalc ({ period = 10, values }: InputCalcEMAInterface): Promise<OutputCalcEMAInterface> {
    const result = ema({
      period,
      values
    })

    const converted: OutputCalcEMAInterface = {
      current: result[result.length - 1],
      previous: result[result.length - 2]
    }

    return converted
  }
}
