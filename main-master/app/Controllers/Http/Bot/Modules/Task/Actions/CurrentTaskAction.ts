import {DateTime} from 'luxon'
import PostEmptyActionsController from 'App/Controllers/Http/Bot/Messages/PostEmptyActionsController'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import HelpersController from 'App/Controllers/Http/Bot/HelpersController'
import Task from 'App/Models/Base/Task'
import PostsController from 'App/Controllers/Http/Bot/PostsController'
import TasksController from 'App/Controllers/Http/Bot/TasksController'
import PostsStatisticsController from 'App/Controllers/Http/Bot/PostsStatisticsController'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'
import AutoCompleteController from 'App/Controllers/Http/Bot/AutoCompleteController'

export default class CurrentTaskAction {
  public static async getCurrentTask (inputValues, count = 0) {
    let task = await TasksController.getTaskByUserId(inputValues)
    let taskCurrent
    if (task) {
      if (!task.current_post_id || task.current_post_id === 0) {
        taskCurrent = await this.getNewTask(inputValues, JSON.parse(task.skipped_post_id), JSON.parse(task.complete_post_id))
      } else {
        taskCurrent = task
      }
    } else {
      taskCurrent = await this.getNewTask(inputValues)
    }
    if (!taskCurrent) {
      return false
    }
    const postById = await PostsController.getPostById(inputValues, taskCurrent.current_post_id)
    if (postById) {
      const postVkApiById = await VkApiController.getPostById(inputValues, `${postById.owner_id}_${postById.post_id}`, false)
      if (postVkApiById.length === 0 && count < 5) {
        count++
        await this.setNulledTask(inputValues)
        await PostsController.changePostStatusZero(inputValues, taskCurrent.current_post_id)
        taskCurrent = await this.getCurrentTask(inputValues, count)
      }
    }
    return taskCurrent
  }
  /* Получаем список всех доступных постов и возвращаем текущий активный пост для пользователя */
  private static async getNewTask (inputValues, skipedPost = [], complitePost = []) {
    const thisTime = DateTime.local()
    const lifetimePost = thisTime.minus({ hours: inputValues.configGroup.settings.lifetime_post })
    const updatedTimePost = thisTime.minus({ minutes: 15 })
    const completedTaskByTransactions = await BufferTransactionsController.getCompletedTaskId(inputValues, lifetimePost)
    const skippedTaskByTransactions = await BufferTransactionsController.getSkippedTaskId(inputValues, lifetimePost)
    const waitingTaskByTransactions = await BufferTransactionsController.getWaitingTaskId(inputValues, lifetimePost)
    const vipPosts = await PostsController.getPostsVip(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const priorityCommandPostsTop = await PostsController.getPostsPriorityCommand(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions, 3)
    const priorityPostsTop = await PostsController.getPostsPriority(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions, 3)
    const priorityCommandPosts = await PostsController.getPostsPriorityCommand(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const commandPosts = await PostsController.getPostsCommands(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const priorityPosts = await PostsController.getPostsPriority(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const allPosts = await PostsController.getPostsAll(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, updatedTimePost, waitingTaskByTransactions)
    if (allPosts.length === 0 && priorityCommandPosts.length === 0 && commandPosts.length === 0 && priorityPosts.length === 0 && vipPosts.length === 0 && priorityCommandPostsTop.length === 0 && priorityPostsTop.length === 0) {
      const params = await PostEmptyActionsController.getActionMessage(inputValues)
      await VkApiController.sendMessage(inputValues, params)
      return false
    }
    const currentPost = await this.getRandomPost(vipPosts, priorityCommandPostsTop, priorityPostsTop, priorityCommandPosts, commandPosts, priorityPosts, allPosts)
    /* проверяем был ли пост выполнен по автозачёту? Может быть автозачёт ещё не добрался до проверки этого поста */
    let postsArray = []
    let postsByVK = {
      count: 0,
    }
    // @ts-ignore
    postsArray.push([currentPost.id, currentPost.owner_id, currentPost.post_id, `${currentPost.owner_id}_${currentPost.post_id}`])
    postsByVK = await AutoCompleteController.getCommentsAndLikesPost(inputValues, postsArray)
    // @ts-ignore
    if (postsByVK.count > 0) {
      // @ts-ignore
      const checkAutoCompletePost = await AutoCompleteController.addPoints(inputValues, postsByVK.items[0])
      if (checkAutoCompletePost) {
        await this.setNulledTask(inputValues)
        return await this.getCurrentTask(inputValues)
      }
    }
    /* Автозачёт END */
    const randomPercent = HelpersController.randomInteger(0, 100)
    let TaskType = 0 //comment
    if (randomPercent < inputValues.configGroup.settings.percent_for_task_type) { // like + comment
      TaskType = 0
      /* } else if (randomPercent >= 30 && randomPercent < 70) { // like*/
    } else if (randomPercent >= inputValues.configGroup.settings.percent_for_task_type) { // like
      TaskType = 1
    }
    await PostsController.changePostStatus(inputValues, currentPost.id) // Меняем статус у поста
    await PostsStatisticsController.setIncrementValue(inputValues, currentPost.id, 'showing')
    const searchPayload = { user_id: inputValues.peerId }
    const persistancePayload = { current_post_id: currentPost.id, type: TaskType }
    Task.connection = inputValues.configGroup.database
    return await Task.updateOrCreate(searchPayload, persistancePayload)
  }
  private static async getRandomPost (vipPosts, priorityCommandPostsTop, priorityPostsTop, priorityCommandPosts, commandPosts, priorityPosts, allPosts) {
    let currentPost
    const randomPostVip = vipPosts[HelpersController.randomInteger(0, vipPosts.length - 1)]
    const randomPriorityCommandPostsTop = priorityCommandPostsTop[HelpersController.randomInteger(0, priorityCommandPostsTop.length - 1)]
    const randomPriorityPostsTop = priorityPostsTop[HelpersController.randomInteger(0, priorityPostsTop.length - 1)]
    const randomPostPriorityCommand = priorityCommandPosts[HelpersController.randomInteger(0, priorityCommandPosts.length - 1)]
    const randomPostCommand = commandPosts[HelpersController.randomInteger(0, commandPosts.length - 1)]
    const randomPostPriority = priorityPosts[HelpersController.randomInteger(0, priorityPosts.length - 1)]
    const randomPostId = allPosts[HelpersController.randomInteger(0, allPosts.length - 1)]
    if (randomPostVip && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPostVip
    } else if (randomPriorityCommandPostsTop && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPriorityCommandPostsTop
    } else if (randomPriorityPostsTop && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPriorityPostsTop
    } else if (randomPostPriorityCommand && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPostPriorityCommand
    } else if (randomPostCommand && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPostCommand
    } else if (randomPostPriority && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPostPriority
    } else {
      currentPost = randomPostId
    }
    return currentPost
  }
  private static async setNulledTask (inputValues: any) {
    const searchPayload = { user_id: inputValues.peerId }
    const persistancePayload = {
      current_post_id: 0,
    }
    return await TasksController.updateTask(inputValues, searchPayload, persistancePayload)
  }
}
