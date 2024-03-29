import TasksActions from 'App/Controllers/Http/Bot/Modules/Task/TasksActions'
import TaskAllMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllMessages'

export default class NoPostActionsController {//если удалили пост из базы
  public static async getActionMessage (inputValues) {
    await TasksActions.skipTask(inputValues)
    return TaskAllMessagesController.getActionMessage(inputValues, 'noPost')
  }
}
