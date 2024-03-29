export default class TaskAddFailureFriendsOnlyMessages {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = '❌ Этот пост доступен "Только для друзей".\nСделай его общедоступным.'
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
