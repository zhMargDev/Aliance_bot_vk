import Post from "App/Models/Base/Post";
import Task from "App/Models/Base/Task";
import { DateTime } from "luxon";
import User from "App/Models/Base/User";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import BufferTransactionsController from "App/Controllers/Http/Bot/BufferTransactionsController";

export default class PostsController {
  //Получаем пост по ID
  public static async getPostById(inputValues, currentPostId) {
    Post.connection = inputValues.configGroup.database;
    return await Post.findBy("id", currentPostId);
  }
  //Получаем пост по owner_id and post_id
  public static async getPostByOwnerIdAndPostId(inputValues, ownerId, postId) {
    Post.connection = inputValues.configGroup.database;
    return await Post.query()
      .where("owner_id", ownerId)
      .where("post_id", postId);
  }
  // Изменяем статус поста
  public static async changePostStatus(inputValues, currentPostId) {
    let statusNew;
    Post.connection = inputValues.configGroup.database;
    const post = await Post.query().where("id", currentPostId);
    // @ts-ignore
    switch (post[0].status) {
      case 0:
        statusNew = 0;
        break;
      case 1:
        statusNew = 3;
        break;
      case 2:
        statusNew = 4;
        break;
      case 3:
        statusNew = 2;
        break;
      case 4:
        statusNew = 1;
        break;
      default:
        statusNew = 1;
        break;
    }
    Post.connection = inputValues.configGroup.database;
    await Post.query().where("id", currentPostId).update({ status: statusNew });
    return true;
  }
  // Изменяем статус поста
  public static async changePostStatusZero(inputValues, currentPostId) {
    Post.connection = inputValues.configGroup.database;
    await Post.query().where("id", currentPostId).update({ status: 0 });
    return true;
  }
  // Получаем количество активных постов
  public static async getActivePostsCount(inputValues) {
    const thisTime = DateTime.local();
    const updatedTimePost = thisTime.minus({ minutes: 15 });
    const lifetimePost = thisTime.minus({
      hours: inputValues.configGroup.settings.lifetime_post,
    });
    Task.connection = inputValues.configGroup.database;
    const task = await Task.findBy("user_id", inputValues.peerId);
    const completedTaskByTransactions =
      await BufferTransactionsController.getCompletedTaskId(
        inputValues,
        lifetimePost
      );
    const skippedTaskByTransactions =
      await BufferTransactionsController.getSkippedTaskId(
        inputValues,
        lifetimePost
      );
    const waitingTaskByTransactions =
      await BufferTransactionsController.getWaitingTaskId(
        inputValues,
        lifetimePost
      );
    let skipped = "[]";
    let complete = "[]";
    if (task) {
      skipped = task.skipped_post_id;
      complete = task.complete_post_id;
    }
    Post.connection = inputValues.configGroup.database;
    const allPosts = await Post.query()
      .count("*")
      // @ts-ignore
      .where("createdAt", ">", DateTime.local().minus({ hours: 36 }))
      .where("user_id", "!=", inputValues.peerId)
      // @ts-ignore
      .where("updatedAt", "<", updatedTimePost)
      .where("status", "!=", 0)
      // @ts-ignore
      .whereNotIn("id", JSON.parse(skipped))
      // @ts-ignore
      .whereNotIn("id", JSON.parse(complete))
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
    return allPosts[0].count;
  }
  // Получаем количество активных командных постов
  public static async getActiveCommandPostsCount(inputValues) {
    const thisTime = DateTime.local();
    const updatedTimePost = thisTime.minus({ minutes: 15 });
    const lifetimePost = thisTime.minus({
      hours: inputValues.configGroup.settings.lifetime_post,
    });
    Task.connection = inputValues.configGroup.database;
    const task = await Task.findBy("user_id", inputValues.peerId);
    const completedTaskByTransactions =
      await BufferTransactionsController.getCompletedTaskId(
        inputValues,
        lifetimePost
      );
    const skippedTaskByTransactions =
      await BufferTransactionsController.getSkippedTaskId(
        inputValues,
        lifetimePost
      );
    const waitingTaskByTransactions =
      await BufferTransactionsController.getWaitingTaskId(
        inputValues,
        lifetimePost
      );
    const group_id = inputValues.currentUser.group_id;
    let skipped = "[]";
    let complete = "[]";
    if (task) {
      skipped = task.skipped_post_id;
      complete = task.complete_post_id;
    }
    Post.connection = inputValues.configGroup.database;
    const allPosts = await Post.query()
      .count("*")
      // @ts-ignore
      .where("createdAt", ">", DateTime.local().minus({ hours: 36 }))
      .where("user_id", "!=", inputValues.peerId)
      // @ts-ignore
      .where("updatedAt", "<", updatedTimePost)
      .where("status", "!=", 0)
      .where("group_id", "=", group_id)
      // @ts-ignore
      .whereNotIn("id", JSON.parse(skipped))
      // @ts-ignore
      .whereNotIn("id", JSON.parse(complete))
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
    return allPosts[0].count;
  }
  public static async getActiveSpotlightPostsCount(inputValues) {
    const thisTime = DateTime.local();
    const updatedTimePost = thisTime.minus({ minutes: 15 });
    const lifetimePost = thisTime.minus({
      hours: inputValues.configGroup.settings.lifetime_post,
    });
    const lifetimePostSpotlight = thisTime.minus({ hours: 72 });
    Task.connection = inputValues.configGroup.database;
    const task = await Task.findBy("user_id", inputValues.peerId);
    const completedTaskByTransactions =
      await BufferTransactionsController.getCompletedTaskId(
        inputValues,
        lifetimePost
      );
    const skippedTaskByTransactions =
      await BufferTransactionsController.getSkippedTaskId(
        inputValues,
        lifetimePost
      );
    const waitingTaskSpoltlightByTransactions =
      await BufferTransactionsController.getWaitingSpotlightTaskId(
        inputValues,
        lifetimePostSpotlight
      );
    let skipped = "[]";
    let complete = "[]";
    if (task) {
      skipped = task.skipped_post_id;
      complete = task.complete_post_id;
    }
    Post.connection = inputValues.configGroup.database;
    const allPosts = await Post.query()
      .count("*")
      // @ts-ignore
      .where("createdAt", ">", DateTime.local().minus({ hours: 72 }))
      .where("user_id", "!=", inputValues.peerId)
      .where("status", "!=", 0)
      .where("type", "=", 2)
      // @ts-ignore
      .whereNotIn("id", JSON.parse(skipped))
      // @ts-ignore
      .whereNotIn("id", JSON.parse(complete))
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskSpoltlightByTransactions);
    console.log(8888999000);
    console.log(skippedTaskByTransactions);
    console.log(waitingTaskSpoltlightByTransactions);
    console.log(allPosts);
    return allPosts[0].count;
  }
  // Валидируем ссылку на пост
  public static async checkLinkPost(inputValues) {
    const text = inputValues.text;
    const attachments = inputValues.attachments[0];
    if (text.includes("vk.com") && text.includes("wall")) {
      return true;
    }
    if (attachments) {
      if (attachments.type === "wall") {
        return true;
      }
    }
    return false;
  }

  public static async getPostsForAutoComplete(inputValues: {
    peerId: number;
    configGroup: any;
  }) {
    Post.connection = inputValues.configGroup.database;
    const posts = await Post.query()
      // @ts-ignore
      .where("createdAt", ">", DateTime.local().minus({ hours: 48 }))
      //.where('user_id', '!=', inputValues.peerId)
      .orderBy("createdAt", "asc");
    return posts;
  }

  /* Получить VIP посты */
  public static async getPostsVip(
    inputValues,
    lifetimePost,
    skippedPost,
    completePost,
    completedTaskByTransactions,
    skippedTaskByTransactions,
    waitingTaskByTransactions
  ) {
    Post.connection = inputValues.configGroup.database;
    return await Post.query() // повышение в приоритете постов vip
      // @ts-ignore
      .where("createdAt", ">", lifetimePost)
      .where("user_id", "!=", inputValues.peerId)
      .where("owner_id", "!=", inputValues.peerId)
      .where("status", "!=", 0)
      .whereIn("owner_id", [1111111111111111111])
      .whereNotIn("id", skippedPost)
      .whereNotIn("id", completePost)
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
  }

  /* Получить посты текущей команды */
  public static async getPostsCommands(
    inputValues,
    lifetimePost,
    skippedPost,
    completePost,
    completedTaskByTransactions,
    skippedTaskByTransactions,
    waitingTaskByTransactions
  ) {
    User.connection = inputValues.configGroup.database;
    const currentUser = await User.findBy("user_id", inputValues.peerId);
    Post.connection = inputValues.configGroup.database;
    return await Post.query() // повышение в приоритете постов vip
      // @ts-ignore
      .where("createdAt", ">", lifetimePost)
      .where("user_id", "!=", inputValues.peerId)
      .where("owner_id", "!=", inputValues.peerId)
      .where("status", "!=", 0)
      // @ts-ignore
      .where("group_id", "=", currentUser.group_id)
      .whereNotIn("id", skippedPost)
      .whereNotIn("id", completePost)
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
  }

  /* Получить посты пользователей команды, сделавших дневные баллы */
  public static async getPostsPriorityCommand(
    inputValues,
    lifetimePost,
    skippedPost,
    completePost,
    completedTaskByTransactions,
    skippedTaskByTransactions,
    waitingTaskByTransactions,
    userStatus = 2
  ) {
    User.connection = inputValues.configGroup.database;
    const currentUser = await User.findBy("user_id", inputValues.peerId);
    const usersPriority = await UsersController.getUsersAllByStatus(
      inputValues,
      userStatus
    );
    const usersPriorityIds = [];
    usersPriority.forEach((user) => {
      if (user.user_id) {
        // @ts-ignore
        usersPriorityIds.push(user.user_id);
      }
    });
    Post.connection = inputValues.configGroup.database;
    return await Post.query() // повышение в приоритете постов vip
      // @ts-ignore
      .where("createdAt", ">", lifetimePost)
      .where("user_id", "!=", inputValues.peerId)
      .where("owner_id", "!=", inputValues.peerId)
      .where("status", "!=", 0)
      // @ts-ignore
      .where("group_id", "=", currentUser.group_id)
      .whereIn("owner_id", usersPriorityIds)
      .whereNotIn("id", skippedPost)
      .whereNotIn("id", completePost)
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
  }

  /* Получить посты пользователей, сделавших дневные баллы */
  public static async getPostsPriority(
    inputValues,
    lifetimePost,
    skippedPost,
    completePost,
    completedTaskByTransactions,
    skippedTaskByTransactions,
    waitingTaskByTransactions,
    userStatus = 2
  ) {
    const usersPriority = await UsersController.getUsersAllByStatus(
      inputValues,
      userStatus
    );
    const usersPriorityIds = [];
    usersPriority.forEach((user) => {
      if (user.user_id) {
        // @ts-ignore
        usersPriorityIds.push(user.user_id);
      }
    });
    Post.connection = inputValues.configGroup.database;
    return await Post.query() // повышение в приоритете постов vip
      // @ts-ignore
      .where("createdAt", ">", lifetimePost)
      .where("user_id", "!=", inputValues.peerId)
      .where("owner_id", "!=", inputValues.peerId)
      .where("status", "!=", 0)
      .whereIn("user_id", usersPriorityIds)
      //.whereIn('owner_id', usersPriorityIds)
      .whereNotIn("id", skippedPost)
      .whereNotIn("id", completePost)
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
  }

  /* Получить посты все посты */
  public static async getPostsAll(
    inputValues,
    lifetimePost,
    skippedPost,
    completePost,
    completedTaskByTransactions,
    skippedTaskByTransactions,
    updatedTimePost,
    waitingTaskByTransactions,
    type = 1
  ) {
    let types = [];
    if (type === 1) {
      // @ts-ignore
      types.push(1);
      // @ts-ignore
      types.push(2);
    } else {
      // @ts-ignore
      types.push(type);
    }
    Post.connection = inputValues.configGroup.database;
    let allPosts = await Post.query() // статус 3 и 4 у постов, которые есть в заданиях у кого-то. Если больше 15 минут прошло, то возвращаем в приоритетную выдачу.
      // @ts-ignore
      .where("createdAt", ">", lifetimePost)
      // @ts-ignore
      .where("updatedAt", "<", updatedTimePost)
      .where("user_id", "!=", inputValues.peerId)
      .where("owner_id", "!=", inputValues.peerId)
      .whereIn("type", types)
      .whereIn("status", [3, 4])
      .whereNotIn("id", skippedPost)
      .whereNotIn("id", completePost)
      .whereNotIn("id", completedTaskByTransactions)
      .whereNotIn("id", skippedTaskByTransactions)
      .whereNotIn("id", waitingTaskByTransactions);
    if (
      allPosts.length === 0 ||
      allPosts.length <= inputValues.currentUser.number_posts_in_list
    ) {
      //вытаскиваем со статусом 1, если таких нет, то 2 и по кругу
      Post.connection = inputValues.configGroup.database;
      const allPosts2 = await Post.query()
        // @ts-ignore
        .where("createdAt", ">", lifetimePost)
        .where("user_id", "!=", inputValues.peerId)
        .where("owner_id", "!=", inputValues.peerId)
        .where("status", "=", 1)
        .whereIn("type", types)
        .whereNotIn("id", skippedPost)
        .whereNotIn("id", completePost)
        .whereNotIn("id", completedTaskByTransactions)
        .whereNotIn("id", skippedTaskByTransactions)
        .whereNotIn("id", waitingTaskByTransactions);
      allPosts = allPosts.concat(allPosts2);
    }
    if (
      allPosts.length === 0 ||
      allPosts.length <= inputValues.currentUser.number_posts_in_list
    ) {
      Post.connection = inputValues.configGroup.database;
      const allPosts3 = await Post.query()
        // @ts-ignore
        .where("createdAt", ">", lifetimePost)
        .where("user_id", "!=", inputValues.peerId)
        .where("owner_id", "!=", inputValues.peerId)
        .where("status", "=", 2)
        .whereIn("type", types)
        .whereNotIn("id", skippedPost)
        .whereNotIn("id", completePost)
        .whereNotIn("id", completedTaskByTransactions)
        .whereNotIn("id", skippedTaskByTransactions)
        .whereNotIn("id", waitingTaskByTransactions);
      allPosts = allPosts.concat(allPosts3);
    }
    return allPosts;
  }
}
