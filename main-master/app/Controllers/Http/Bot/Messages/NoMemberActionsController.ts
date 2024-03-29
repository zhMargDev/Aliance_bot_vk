import TextsController from 'App/Controllers/Http/Bot/TextsController'

export default class NoMemberActionsController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'noMember', 0)
    return ActionResponse
  }
}
