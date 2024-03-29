export default class StopChatAction {
  public static async checkChatCommand (inputValues) {
    const startWords = ['старт', 'начать','открыть']
    const stopWords = ['стоп', 'конец','закончить','закрыть']
    const text = inputValues.text
    const filterStartChat = startWords.filter((word) => {
      return word === text
    })
    const filterStopChat = stopWords.filter((word) => {
      return word === text
    })
    if (filterStartChat.length) {
      return 'start_admin'
    }
    if (filterStopChat.length) {
      return 'stop_admin'
    }
    return ''
  }
}
