import TextsController from 'App/Controllers/Http/Bot/TextsController'

export default class PostEmptyActionsController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'tasks', 'empty')
    ActionResponse.keyboard = {
      'one_time': false,
      'buttons': [
        [{
          'action': {
            'type': 'text',
            'payload': {CHATBOT: 'BACK'},
            'label': '🔙 Вернуться',
          },
          'color': 'secondary',
        }],
      ],
    }
    return ActionResponse
  }
}
