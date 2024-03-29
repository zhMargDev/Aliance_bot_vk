import Task from 'App/Models/Base/Task'

export default class TasksController {
  public static async getTaskAll (inputValues): Promise<any> {
    Task.connection = inputValues.configGroup.database
    return await Task.all()
  }
  // Получаем задание по UserId
  public static async getTaskByUserId (inputValues) {
    Task.connection = inputValues.configGroup.database
    const task = await Task.findBy('user_id', inputValues.peerId)
    return task
  }
  // Обновляем задание
  public static async updateTask (inputValues, searchPayload, persistancePayload) {
    Task.connection = inputValues.configGroup.database
    return await Task.updateOrCreate(searchPayload, persistancePayload)
  }
}
