import { Duration } from 'luxon'

export default class TaskAddFailureOldPostMessagesController {
  public static async getActionMessage (max_post_age) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    const MaxPostAgeHours = Duration.fromObject({seconds: max_post_age}).as('hours')
    ActionResponse.message = `❌ Пост должен быть не старше ${MaxPostAgeHours} часов.`
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
