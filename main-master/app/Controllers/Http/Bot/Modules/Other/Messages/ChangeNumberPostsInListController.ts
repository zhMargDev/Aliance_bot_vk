export default class ChangeNumberPostsInListController {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '✔ Отлично! Количество постов в списке изменено.'
    return ActionResponse
  }
  public static async getActionErrorMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '✖ Количество постов должно быть больше 0 и не больше 30.\nПроверь правильность написания, например, посты:15'
    return ActionResponse
  }
}
