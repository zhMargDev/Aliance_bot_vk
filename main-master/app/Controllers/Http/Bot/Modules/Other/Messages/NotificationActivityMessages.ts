export default class NotificationActivityMessages {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '✔ Отлично! Если ты будешь забывать заходить в бота, то мы пришлём тебе напоминалку.'
    return ActionResponse
  }
  public static async getActionZeroMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '✔ Напоминалка отключена! Надеюсь, ты не будешь забывать заходить в бота :)'
    return ActionResponse
  }
  public static async getActionErrorMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '✖ Количество дней "неактивности" должно быть больше 0 и не больше 7.\nПроверь правильность написания, например, напоминалка:5'
    return ActionResponse
  }
  public static async NotificationActivityMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = 'Появилось много интересных постов, возвращайся :)\nЕсли не хочешь получать напоминания, то просто напиши в чат напоминалка:0'
    return ActionResponse
  }
}
