const QCC = "QCC"

type QccSubKey = keyof QccLocalData

interface QccLocalData {
  pickupLocationIndex: number
}

export const writeToLocalStorage = (
  key: QccSubKey,
  data: unknown
): Partial<QccLocalData> => {
  let localData: QccLocalData
  try {
    localData = JSON.parse(localStorage.getItem(QCC))
  } catch (error) {
    console.error("Couldn't read from local storage, resetting to {}")
    localData = {
      pickupLocationIndex: null,
    }
  }
  const updatedData = { ...localData, [key]: data }
  localStorage.setItem(QCC, JSON.stringify(updatedData))
  return { [key]: data } as unknown
}

export const readFromLocalStorage = (key: QccSubKey): unknown => {
  let localData: QccLocalData
  try {
    localData = JSON.parse(localStorage.getItem(QCC))
    return localData[key]
  } catch (error) {
    console.error("Couldn't read from local storage")
  }
}
