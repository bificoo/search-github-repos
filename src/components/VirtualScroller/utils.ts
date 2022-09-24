import { Settings, CompoundSettings } from "./index"
export const getInitialSetting = ({
  minIndex,
  maxIndex,
  startIndex,
  viewportHeight,
  itemHeight,
  loadingHeight,
  tolerance,
}: Settings): CompoundSettings => {
  const amount = Math.floor(viewportHeight / itemHeight)
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight + loadingHeight
  const toleranceHeight = tolerance * itemHeight
  const bufferHeight = viewportHeight + 2 * toleranceHeight
  const bufferedAmount = amount + 2 * tolerance
  const itemsAbove = startIndex - tolerance - minIndex
  const topPaddingHeight = itemsAbove * itemHeight
  const bottomPaddingHeight = totalHeight - topPaddingHeight
  const initialPosition = topPaddingHeight + toleranceHeight
  return {
    minIndex,
    maxIndex,
    startIndex,
    viewportHeight,
    itemHeight,
    loadingHeight,
    amount,
    tolerance,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedAmount,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
  }
}
