import TextsController from 'App/Controllers/Http/Bot/TextsController'

export default class DesertDay3NextMessagesController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {
        'one_time': false,
        'buttons': [
          [{
            'action': {
              'type': 'text',
              'payload': {TASK: 'TALL'},
              'label': 'Выполнить задания',
            },
            'color': 'positive',
          }],
        ],
      },
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'days', 'day3Next')
    return ActionResponse
  }

  public static async getActionDoneTasksMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {
        'one_time': false,
        'buttons': [
          [{
            'action': {
              'type': 'text',
              'payload': {DESERT: 'DAY3'},
              'label': 'Есть',
            },
            'color': 'positive',
          }],
        ],
      },
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'days', 'day3Done')
    return ActionResponse
  }
}
