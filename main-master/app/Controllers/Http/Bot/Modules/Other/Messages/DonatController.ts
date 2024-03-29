export default class DonatController {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = 'Доступно только для Донов сообщества.\nОформить подписку ты можешь здесь https://vk.com/donut/dopester'
    return ActionResponse
  }
}
