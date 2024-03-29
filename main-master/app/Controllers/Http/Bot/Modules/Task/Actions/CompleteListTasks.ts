//import PostsController from 'App/Controllers/Http/Bot/PostsController'
// import AutoCompleteController from 'App/Controllers/Http/Bot/AutoCompleteController'
import TaskAllLikesMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllLikesMessages'
import TransactionsController from '../../../TransactionsController'
import BufferTransactionsController from '../../../BufferTransactionsController'

export default class CompleteListTasks {
  public static async init (inputValues) {
    // let completePostPoints = 0
    //let currentPost
    let postsId = inputValues.payload.TASK.split(';')
    postsId.shift()
    postsId.pop()
    /* проверяем был ли пост выполнен по автозачёту? Может быть автозачёт ещё не добрался до проверки этого поста */
    /* let postsArray = []
    let postsByVK = {
      count: 0,
      items: [],
    } */
    for (const postId of postsId) {
      // currentPost = await PostsController.getPostById(inputValues, postId)
      await TransactionsController.store(inputValues, postId, 10, 1)
      await BufferTransactionsController.store(inputValues, postId, 10, 1)
      // @ts-ignore
      //postsArray.push([currentPost.id, currentPost.owner_id, currentPost.post_id, `${currentPost.owner_id}_${currentPost.post_id}`])
    }
    return await TaskAllLikesMessagesController.getActionCompleteMessage(inputValues)
    // postsByVK = await AutoCompleteController.getCommentsAndLikesPost(inputValues, postsArray)
    /* if (postsByVK.count === 0) {
      postsByVK = await AutoCompleteController.getCommentsAndLikesPost(inputValues, postsArray)
    }
    if (postsByVK.count === 0) {
      postsByVK = await AutoCompleteController.getCommentsAndLikesPost(inputValues, postsArray)
    } */
    /*console.log('postsByVK - 1')
    console.log(postsByVK)
    // @ts-ignore
    if (postsByVK.count > 0) {
      for (const postByVK of postsByVK.items) {
        completePostPoints = completePostPoints + await AutoCompleteController.addPointsForList(inputValues, postByVK)
      }
    } else {
      return await TaskAllLikesMessagesController.getActionCompleteMessage(inputValues, 3000) // если 3000, то автозачёт
    }*/
    /* Автозачёт END */
    // return await TaskAllLikesMessagesController.getActionCompleteMessage(inputValues, completePostPoints)
  }
}
