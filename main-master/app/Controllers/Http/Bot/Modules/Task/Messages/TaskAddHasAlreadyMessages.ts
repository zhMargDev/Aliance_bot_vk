export default class TaskAddHasAlreadyMessagesController {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '❌ Этот пост уже есть в боте. Попробуй другой.'
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
