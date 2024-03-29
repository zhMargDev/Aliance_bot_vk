import TextsController from 'App/Controllers/Http/Bot/TextsController'

export default class DesertDay1MessagesController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'days', 'day1Init')
    ActionResponse.keyboard = {
      'one_time': true,
      'buttons': [],
    }
    return ActionResponse
  }
}
