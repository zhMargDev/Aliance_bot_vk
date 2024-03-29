import PostsController from 'App/Controllers/Http/Bot/PostsController'
import TasksController from 'App/Controllers/Http/Bot/TasksController'
import TaskAllMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllMessages'
import ErrorMessagesController from 'App/Controllers/Http/Bot/Errors/Messages/ErrorMessagesController'
import ErrorActionController from 'App/Controllers/Http/Bot/Errors/Actions/ErrorActionController'
import TransactionsController from 'App/Controllers/Http/Bot/TransactionsController'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'
import UsersInfoController from 'App/Controllers/Http/Bot/UsersInfoController'
import PostsStatisticsController from 'App/Controllers/Http/Bot/PostsStatisticsController'

export default class SkipTaskAction {
  public static async getAction (inputValues) {
    let task = await TasksController.getTaskByUserId(inputValues)
    if (task && task.current_post_id !== 0) {
      await PostsController.changePostStatus(inputValues, task.current_post_id) // Меняем статус у поста
      const searchPayload = { user_id: inputValues.peerId }
      const persistancePayload = { current_post_id: 0 }
      await TasksController.updateTask(inputValues, searchPayload, persistancePayload)
      await PostsStatisticsController.setIncrementValue(inputValues, task.current_post_id, 'skipped')
      await UsersInfoController.changeValue(inputValues, 'skipped')
      await TransactionsController.store(inputValues, task.current_post_id, 4, 1)
      await BufferTransactionsController.store(inputValues, task.current_post_id, 4, 1)
      return TaskAllMessagesController.getActionMessage(inputValues, 'skip')
    }
    const textError = 'errorSkip: Ошибка при пропуске задания'
    await ErrorActionController.sendAdminErrorAction(inputValues, textError)
    return ErrorMessagesController.getUserErrorMessage(inputValues)
  }
}
