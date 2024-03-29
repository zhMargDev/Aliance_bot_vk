export default class TaskAddFailureErrorTaskMessages {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '❌ Добавление нового поста пока тебе недоступно.\nНеобходимо выполнить задания.'
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
