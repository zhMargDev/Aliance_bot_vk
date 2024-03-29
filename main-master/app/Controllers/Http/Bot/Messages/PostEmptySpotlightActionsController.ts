export default class PostEmptySpotlightActionsController {
  public static async getActionMessage () {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = 'К сожалению, в Прожекторе сейчас нет доступных постов. Попробуй вернуться чуть позднее или почитай посты из стандартного списка.'
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
