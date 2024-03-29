import TaskAllMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllMessages'

export default class TaskPointsFailMessages {
  public static async getActionMessage (inputValues, type) {
    return TaskAllMessagesController.getActionMessage(inputValues, type)
  }
}
