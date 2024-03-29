import Group from 'App/Models/Base/Group'
import TextsController from 'App/Controllers/Http/Bot/TextsController'

export default class GroupsChoiseActionsController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    Group.connection = inputValues.configGroup.database
    const groups = await Group.query().orderBy('weight', 'asc')
    const buttons : any[] = []
    let buttonsGroups : any[] = []
    groups.forEach((interest, i) => {
      const item = [{
        'action': {
          'type': 'text',
          'payload': {INTEREST: interest.id},
          'label': interest.name,
        },
        'color': 'primary',
      }]
      buttonsGroups.push(...item)
      if (i % 2 !== 0) {
        buttons.push(...[buttonsGroups])
        buttonsGroups = []
      }
    })
    const back = [[{
      'action': {
        'type': 'text',
        'payload': {CHATBOT: 'BACK'},
        'label': '🔙 Вернуться',
      },
      'color': 'secondary',
    }]]
    buttons.push(...back)
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'interests', 0)
    ActionResponse.keyboard = {
      'one_time': false,
      'buttons': buttons,
    }
    return ActionResponse
  }
}
