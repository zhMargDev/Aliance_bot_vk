import PostStatistic from 'App/Models/Base/PostStatistic'

export default class PostsStatisticsController {
  //Получаем пост по ID
  public static async getPostStatisticByPostId (inputValues, postId) {
    PostStatistic.connection = inputValues.configGroup.database
    return await PostStatistic
      .query()
      .where('post_id', postId)
      .orderBy('createdAt', 'desc')
      .first()
  }
  public static async setPostStatistic (inputValues, post) {
    let bot_likes_count
    let bot_auto_likes_count
    let bot_comments_count
    let bot_auto_comments_count
    let showing
    let auto_completed
    let completed
    let skipped
    const postStatisticCurrent = await this.getPostStatisticByPostId(inputValues, post.postId)
    if (postStatisticCurrent) {
      bot_likes_count = postStatisticCurrent.bot_likes_count
      bot_auto_likes_count = postStatisticCurrent.bot_auto_likes_count
      bot_comments_count = postStatisticCurrent.bot_comments_count
      bot_auto_comments_count = postStatisticCurrent.bot_auto_comments_count
      showing = postStatisticCurrent.showing
      completed = postStatisticCurrent.completed
      auto_completed = postStatisticCurrent.auto_completed
      skipped = postStatisticCurrent.skipped
    } else {
      bot_likes_count = 0
      bot_auto_likes_count = 0
      bot_comments_count = 0
      bot_auto_comments_count = 0
      showing = 0
      completed = 0
      auto_completed = 0
      skipped = 0
    }
    if (post.postInfo && post.postInfo.length === 0) {
      return false
    }
    PostStatistic.connection = inputValues.configGroup.database
    const postStatisticNew = new PostStatistic()
    postStatisticNew.post_id = post.postId
    postStatisticNew.views_count = post.postInfo[0].views ? post.postInfo[0].views.count : 0
    postStatisticNew.reposts_count = post.postInfo[0].reposts ? post.postInfo[0].reposts.count : 0
    postStatisticNew.likes_count = post.postInfo[0].likes ? post.postInfo[0].likes.count : 0
    postStatisticNew.bot_likes_count = bot_likes_count
    postStatisticNew.bot_auto_likes_count = bot_auto_likes_count
    postStatisticNew.comments_count = post.postInfo[0].comments ? post.postInfo[0].comments.count : 0
    postStatisticNew.bot_comments_count = bot_comments_count
    postStatisticNew.bot_auto_comments_count = bot_auto_comments_count
    postStatisticNew.showing = showing
    postStatisticNew.completed = completed
    postStatisticNew.auto_completed = auto_completed
    postStatisticNew.skipped = skipped
    await postStatisticNew.save()
    if (postStatisticNew.$isPersisted) {
      return true
    }
    return false
  }
  public static async setIncrementValue (inputValues, postId, column) {
    let postStatisticCurrent = await this.getPostStatisticByPostId(inputValues, postId)
    if (!postStatisticCurrent) {
      postStatisticCurrent = new PostStatistic()
      postStatisticCurrent.post_id = postId
      await postStatisticCurrent.save()
    }
    PostStatistic.connection = inputValues.configGroup.database
    await PostStatistic
      .query()
      // @ts-ignore
      .where('id', postStatisticCurrent.id)
      .orderBy('createdAt', 'desc')
      .increment(column, 1)
      .first()
    return true
  }
}
