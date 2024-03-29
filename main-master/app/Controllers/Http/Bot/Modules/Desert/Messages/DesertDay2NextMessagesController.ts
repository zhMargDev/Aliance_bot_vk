import TextsController from 'App/Controllers/Http/Bot/TextsController'

export default class DesertDay2NextMessagesController {
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
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'days', 'day2Next')
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
              'payload': {DESERT: 'DAY2'},
              'label': 'Выполнено',
            },
            'color': 'positive',
          }],
        ],
      },
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'days', 'day2Done')
    return ActionResponse
  }
}
