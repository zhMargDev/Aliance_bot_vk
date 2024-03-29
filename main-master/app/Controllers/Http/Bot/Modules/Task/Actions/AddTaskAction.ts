import Post from "App/Models/Base/Post";
import User from "App/Models/Base/User";
import TaskAddSuccessMessagesController from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddSuccessMessages";
import VkApiController from "App/Controllers/Http/Bot/Api/VkApiController";
import TaskAddFailureMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureMessages";
import TaskAddHasAlreadyMessagesController from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddHasAlreadyMessages";
import { DateTime } from "luxon";
import TaskAddFailureOldPostMessagesController from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureOldPostMessages";
import TaskAddFailureActivePostMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureActivePostMessages";
import HelpersController from "App/Controllers/Http/Bot/HelpersController";
import Task from "App/Models/Base/Task";
import TaskAddFailureErrorTaskMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureErrorTaskMessages";
import CurrentTaskAction from "App/Controllers/Http/Bot/Modules/Task/Actions/CurrentTaskAction";
import TasksController from "App/Controllers/Http/Bot/TasksController";
import TransactionsController from "App/Controllers/Http/Bot/TransactionsController";
import BufferTransactionsController from "App/Controllers/Http/Bot/BufferTransactionsController";
import UsersInfoController from "App/Controllers/Http/Bot/UsersInfoController";
//import TaskAddFailureOwnerAdminMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureOwnerAdminMessages'
//import TaskAddFailureNoPersonalPageMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureNoPersonalPageMessages'
import TaskAddFailureNoPostMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureNoPostMessages";
import TaskAddFailureCloseCommentsMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureCloseCommentsMessages";
import TaskAddFailureFriendsOnlyMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddFailureFriendsOnlyMessages";

export default class AddTaskAction {
  public static async init(inputValues) {
    let text = inputValues.text;
    let attachments = inputValues.attachments;
    let postId;
    let owner_id;
    let post_id;
    let stop_like = 999999999;
    if (text) {
      if (text.includes("стоп:")) {
        stop_like = await this.checkStopLike(text);
      }
      text = HelpersController.clearTextLinkPost(text);
      postId = text.split("_");
      owner_id = postId[0];
      post_id = postId[1];
    } else if (attachments) {
      owner_id = Number.parseInt(attachments[0].wall.from_id);
      post_id = Number.parseInt(attachments[0].wall.id);
    }
    Task.connection = inputValues.configGroup.database;
    let task = await Task.findBy("user_id", inputValues.peerId);
    if (!task) {
      await CurrentTaskAction.getCurrentTask(inputValues);
      task = await TasksController.getTaskByUserId(inputValues);
    }
    /* проверяем, выполнил ли задания человек и не прошли ли сутки с этого момента */
    if (inputValues.configGroup.groupId !== "435435435345") {
      const thisTime = DateTime.local();
      const lifetimePost = thisTime.minus({
        hours: inputValues.configGroup.settings.hours_since_adding,
      });
      const completedTaskByTransactions =
        await BufferTransactionsController.getCompletedTaskId(
          inputValues,
          lifetimePost
        );
      if (
        inputValues.configGroup.settings.min_task_day >
        completedTaskByTransactions.length
      ) {
        return await TaskAddFailureErrorTaskMessages.getActionMessage();
      }
    }
    /* Проверка: сколько активных постов */
    if (
      (await this.checkActivePosts(inputValues)) ||
      inputValues.peerId === 1111111111111111111
    ) {
    } else {
      return await TaskAddFailureActivePostMessages.getActionMessage();
    }
    console.log(777);
    const postById = await VkApiController.getPostById(
      inputValues,
      `${owner_id}_${post_id}`,
      false
    );
    console.log(postById);
    /* Проверка: существует ли пост */
    if (postById.length === 0) {
      return await TaskAddFailureNoPostMessages.getActionMessage();
    }
    /* Проверка: пост с личной страницы или группы, где пользователь админ */
    /*if (!await this.checkPersonalPageOrAdmin(inputValues, owner_id)) {
      return false
    }*/
    console.log(1);
    /* Проверка: есть ли этот пост в боте */
    if (!(await this.checkExistPost(inputValues, owner_id, post_id))) {
      return await TaskAddHasAlreadyMessagesController.getActionMessage();
    }
    console.log(2);
    /* Проверка: открыты ли комментарии */
    /*if (!postById[0].comments.can_post) { // ВК перестал корректно отвечать
      return await TaskAddFailureCloseCommentsMessages.getActionMessage()
    }*/
    /* Проверка: Только для друзей */
    if (postById[0].friends_only) {
      return await TaskAddFailureFriendsOnlyMessages.getActionMessage();
    }
    console.log(3);
    /* Проверка: когда был выложен пост */
    if (!(await this.checkOldPost(inputValues, postById))) {
      return await TaskAddFailureOldPostMessagesController.getActionMessage(
        inputValues.configGroup.settings.max_post_age
      );
    }
    console.log(4);
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.query()
      .where("user_id", inputValues.peerId)
      .firstOrFail();
    const user = userCurrent.serialize();
    console.log(4);
    Post.connection = inputValues.configGroup.database;
    const postNew = new Post();
    postNew.user_id = inputValues.peerId;
    postNew.social = 1;
    postNew.type = 1;
    postNew.group_id = user.group_id;
    postNew.owner_id = owner_id;
    postNew.post_id = post_id;
    postNew.stop_like = stop_like;
    postNew.status = 1;
    await postNew.save();
    console.log(5);
    if (postNew.$isPersisted) {
      console.log(6);
      await UsersInfoController.changeValue(inputValues, "added");
      console.log(7);
      // @ts-ignore
      await TransactionsController.store(
        inputValues,
        postNew.current_post_id,
        5,
        1
      );
      console.log(8);
      // @ts-ignore
      await BufferTransactionsController.store(
        inputValues,
        postNew.current_post_id,
        5,
        1
      );
      console.log(8);
      return await TaskAddSuccessMessagesController.getActionMessage(
        inputValues,
        stop_like
      );
    } else {
      console.log(9);
      return await TaskAddFailureMessages.getActionMessage(inputValues);
    }
  }

  public static async checkOldPost(inputValues, postById) {
    let postDate =
      postById[0].date + inputValues.configGroup.settings.max_post_age;
    postDate = postDate.toString().padEnd(13, "0");
    postDate = parseInt(postDate);
    // @ts-ignore
    let thisDate = DateTime.local().ts;
    thisDate = thisDate.toString().padEnd(13, "0");
    thisDate = parseInt(thisDate);
    // @ts-ignore
    if (postDate < thisDate) {
      return false;
    }
    return true;
  }

  /*private static async checkPersonalPageOrAdmin (inputValues, owner_id) {
    if (owner_id.includes('-')) { // если группа
      //const ownerIdClear = owner_id.replace('-', '')
      const groupsAdmin = await VkApiController.getGroupsAdmin(inputValues)
      if(!groupsAdmin) {
        return true
      }
      const items = groupsAdmin.items
      let errorOwner = false
      items.forEach(function (item) {
        if (item.id === ownerIdClear) {
          errorOwner = true
        }
      })
      if (!errorOwner) {
        const params = await TaskAddFailureOwnerAdminMessagesController.getActionMessage() //ошибка если человек не админ
        await VkApiController.sendMessage(inputValues, params)
        return false
      //}
      return true
    } else if (parseInt(owner_id) !== inputValues.peerId) {
      const params = await TaskAddFailureNoPersonalPageMessagesController.getActionMessage() // пост не с личной страницы
      await VkApiController.sendMessage(inputValues, params)
      return false
    }
    return true
  }*/

  public static async checkActivePosts(inputValues: any) {
    Post.connection = inputValues.configGroup.database;
    const allActiveUserPosts = await Post.query()
      // @ts-ignore
      .where(
        "createdAt",
        ">",
        DateTime.local().plus({
          hours: -inputValues.configGroup.settings.hours_since_adding,
        })
      )
      .where("user_id", "=", inputValues.peerId)
      .where("status", "!=", 0);
    if (
      allActiveUserPosts.length >=
      inputValues.configGroup.settings.max_active_post
    ) {
      return false;
    }
    return true;
  }

  private static async checkStopLike(text) {
    let stop_like;
    stop_like = text.split(":").pop();
    if (stop_like) {
      parseInt(stop_like);
      if (stop_like > 0 && stop_like < 999999999) {
        return stop_like;
      }
    }
    return 999999999;
  }

  private static async checkExistPost(inputValues, ownerId, postId) {
    Post.connection = inputValues.configGroup.database;
    const posts = await Post.query()
      .where("owner_id", ownerId)
      .where("post_id", postId);
    if (posts.length !== 0) {
      return false;
    }
    return true;
  }
}
