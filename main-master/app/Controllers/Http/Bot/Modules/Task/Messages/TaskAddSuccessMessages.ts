import TextsController from 'App/Controllers/Http/Bot/TextsController';

export default class TaskAddSuccessMessagesController {
  public static async getActionMessage (inputValues, stop_like) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'tasks', 'addSuccess')
    if (stop_like > 0 && stop_like !== 999999999) {
      ActionResponse.message = ActionResponse.message + '\n Ограничение лайков: ' + stop_like
    }
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
