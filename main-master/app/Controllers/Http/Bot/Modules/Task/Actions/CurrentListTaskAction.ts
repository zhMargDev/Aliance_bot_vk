import {DateTime} from 'luxon'
import PostEmptyActionsController from 'App/Controllers/Http/Bot/Messages/PostEmptyActionsController'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import HelpersController from 'App/Controllers/Http/Bot/HelpersController'
import PostsController from 'App/Controllers/Http/Bot/PostsController'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'
//import AutoCompleteController from 'App/Controllers/Http/Bot/AutoCompleteController'

export default class CurrentListTaskAction {
  /* Получаем список всех доступных постов и возвращаем текущий активный пост для пользователя */
  public static async getListTasks (inputValues, skipedPost = [], complitePost = []) {
    const thisTime = DateTime.local()
    const lifetimePost = thisTime.minus({ hours: inputValues.configGroup.settings.lifetime_post })
    const updatedTimePost = thisTime.minus({ minutes: 15 })
    const completedTaskByTransactions = await BufferTransactionsController.getCompletedTaskId(inputValues, lifetimePost)
    const skippedTaskByTransactions = await BufferTransactionsController.getSkippedTaskId(inputValues, lifetimePost)
    const waitingTaskByTransactions = await BufferTransactionsController.getWaitingTaskId(inputValues, lifetimePost)
    const vipPosts = await PostsController.getPostsVip(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const priorityCommandPosts = await PostsController.getPostsPriorityCommand(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const commandPosts = await PostsController.getPostsCommands(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const priorityPosts = await PostsController.getPostsPriority(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, waitingTaskByTransactions)
    const allPosts = await PostsController.getPostsAll(inputValues, lifetimePost, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, updatedTimePost, waitingTaskByTransactions)
    if (allPosts.length === 0 && priorityCommandPosts.length === 0 && commandPosts.length === 0 && priorityPosts.length === 0 && vipPosts.length === 0) {
      const params = await PostEmptyActionsController.getActionMessage(inputValues)
      await VkApiController.sendMessage(inputValues, params)
      return false
    }
    const currentPosts = await this.getCurrentPosts(inputValues, vipPosts, priorityCommandPosts, commandPosts, priorityPosts, allPosts)
    let uniquePosts = await this.getUniquePosts(currentPosts)
    uniquePosts = [
      ...uniquePosts,
      ...await this.getCurrentAllPosts(allPosts),
    ]
    let number_posts_in_list = 5
    if (
      inputValues.currentUser.number_posts_in_list > 0 &&
      inputValues.currentUser.number_posts_in_list < 31
    ) {
      number_posts_in_list = inputValues.currentUser.number_posts_in_list
    }
    return (await this.getUniquePosts(uniquePosts)).slice(0, number_posts_in_list)
  }
  private static async getCurrentPosts (inputValues, vipPosts, priorityCommandPosts, commandPosts, priorityPosts, allPosts) {
    const result = []
    for (let index = 0; index < 300; index++) {
      // @ts-ignore
      result.push(await this.getRandomPost(inputValues, vipPosts, priorityCommandPosts, commandPosts, priorityPosts, allPosts))
    }
    return result
  }
  private static async getCurrentAllPosts (allPosts) {
    const result = []
    for (let index = 0; index < 300; index++) {
      // @ts-ignore
      result.push(allPosts[HelpersController.randomInteger(0, allPosts.length - 1)])
    }
    return result
  }
  /*private static async getRandomPost (inputValues, vipPosts, priorityCommandPosts, commandPosts, priorityPosts, allPosts, count = 0) {
    const currentPost = await this.getRandomPostOne(vipPosts, priorityCommandPosts, commandPosts, priorityPosts, allPosts)
    if (!currentPost) {
      return false
    }
    count++
    if (count === 3) {
      return currentPost
    }
    const postVkApiById = await VkApiController.getPostById(inputValues, `${currentPost.owner_id}_${currentPost.post_id}`, false)
    if (postVkApiById.length === 0) {
      await PostsController.changePostStatusZero(inputValues, currentPost.id)
      return false
    }
    // проверяем был ли пост выполнен по автозачёту? Может быть автозачёт ещё не добрался до проверки этого поста
    let completePostPoints = 0
    let postsArray = []
    let postsByVK = {
      count: 0,
      items: [],
    }
    // @ts-ignore
    postsArray.push([currentPost.id, currentPost.owner_id, currentPost.post_id, `${currentPost.owner_id}_${currentPost.post_id}`])
    postsByVK = await AutoCompleteController.getCommentsAndLikesPost(inputValues, postsArray)
    // @ts-ignore
    if (postsByVK.count > 0) {
      for (const postByVK of postsByVK.items) {
        // @ts-ignore
        completePostPoints = completePostPoints + await AutoCompleteController.addPointsForList(inputValues, postByVK)
      }
    }
    if (completePostPoints === 0) {
      return currentPost
    }
    // Автозачёт END
    return await this.getRandomPost(inputValues, vipPosts, priorityCommandPosts, commandPosts, priorityPosts, count)
  } */
  private static async getRandomPost (vipPosts, priorityCommandPosts, commandPosts, priorityPosts, allPosts) {
    let currentPost
    const randomPostVip = vipPosts[HelpersController.randomInteger(0, vipPosts.length - 1)]
    const randomPostPriorityCommand = priorityCommandPosts[HelpersController.randomInteger(0, priorityCommandPosts.length - 1)]
    const randomPostCommand = commandPosts[HelpersController.randomInteger(0, commandPosts.length - 1)]
    const randomPostPriority = priorityPosts[HelpersController.randomInteger(0, priorityPosts.length - 1)]
    const randomPostId = allPosts[HelpersController.randomInteger(0, allPosts.length - 1)]
    if (randomPostVip && (HelpersController.randomInteger(0, 100) < 99)) {
      currentPost = randomPostVip
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
  private static async getUniquePosts (currentPosts) {
    const result : string[] = []
    const uniquePosts : object[] = []
    for (let post of currentPosts) {
      if (post && !result.includes(post.id)) {
        result.push(post.id)
        uniquePosts.push(post)
      }
    }
    return uniquePosts
  }
}
