import UsersController from 'App/Controllers/Http/Bot/UsersController'

export default class GroupsChoiseAddActionsController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    const result = await UsersController.addInterest(inputValues)
    if (result) {
      ActionResponse.message = 'Команда изменена'
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
    } else {
      ActionResponse.message = 'Что-то пошло не так. Свяжись с администратором.'
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
    }
    return ActionResponse
  }
}
