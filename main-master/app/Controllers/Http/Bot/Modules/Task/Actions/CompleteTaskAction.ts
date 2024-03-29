import Task from "App/Models/Base/Task";
import VkApiController from "App/Controllers/Http/Bot/Api/VkApiController";
import PostsController from "App/Controllers/Http/Bot/PostsController";
import TasksController from "App/Controllers/Http/Bot/TasksController";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import ErrorActionController from "App/Controllers/Http/Bot/Errors/Actions/ErrorActionController";
import TransactionsController from "App/Controllers/Http/Bot/TransactionsController";
import BufferTransactionsController from "App/Controllers/Http/Bot/BufferTransactionsController";
import UsersInfoController from "App/Controllers/Http/Bot/UsersInfoController";
import PostsStatisticsController from "App/Controllers/Http/Bot/PostsStatisticsController";
import TaskAllMessagesController from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllMessages";
import TaskPointsFailMessages from "App/Controllers/Http/Bot/Modules/Task/Messages/TaskPointsFailMessages";
import ErrorMessagesController from "App/Controllers/Http/Bot/Errors/Messages/ErrorMessagesController";

export default class CompleteTaskAction {
  public static async init(inputValues) {
    let task = await TasksController.getTaskByUserId(inputValues);
    if (task) {
      if (task.current_post_id === 0) {
        await this.fakeComplete(inputValues);
        return TaskAllMessagesController.getActionMessage(
          inputValues,
          "complete",
          { pointsAll: 3 }
        );
      }
      const post = await PostsController.getPostById(
        inputValues,
        task.current_post_id
      );
      if (post) {
        const pointsForLike = await this.getPointsForLike(inputValues, post);
        const pointsForComments = await this.getPointsForComment(
          inputValues,
          post
        );
        if (
          ![
            "18694543543525139",
            "2353254325",
            "32532532",
            "532532523532",
          ].includes(inputValues.configGroup.groupId)
        ) {
          const statusErrorCompleteTask =
            await this.checkStatusErrorCompleteTask(
              inputValues,
              task,
              pointsForLike,
              pointsForComments
            );
          // Если задание не выполнено, то отправляем пользователю сообщение, что ему нужно сделать для выполнения
          if (statusErrorCompleteTask) {
            return statusErrorCompleteTask;
          }
        }
        let pointsAll = pointsForComments + pointsForLike;
        await UsersController.changePointsAll(inputValues, pointsAll); // Меняем количество общих баллов у пользователя
        if (pointsForLike > 0) {
          await TransactionsController.store(
            inputValues,
            task.current_post_id,
            1,
            1,
            { points: pointsForLike }
          );
          await BufferTransactionsController.store(
            inputValues,
            task.current_post_id,
            1,
            1,
            { points: pointsForLike }
          );
        }
        if (pointsForComments > 0) {
          await TransactionsController.store(
            inputValues,
            task.current_post_id,
            2,
            1,
            { points: pointsForComments }
          );
          await BufferTransactionsController.store(
            inputValues,
            task.current_post_id,
            2,
            1,
            { points: pointsForComments }
          );
        }
        /* Добавляем пост в выполненные */
        await this.setCompletedTask(inputValues, task);
        await PostsController.changePostStatus(
          inputValues,
          task.current_post_id
        ); // Меняем статус у поста
        await PostsStatisticsController.setIncrementValue(
          inputValues,
          task.current_post_id,
          "completed"
        );
        await UsersInfoController.changeValue(inputValues, "completed");
        await UsersController.changeStatusPriorityUser(inputValues);
        return TaskAllMessagesController.getActionMessage(
          inputValues,
          "complete",
          { pointsAll: pointsAll }
        );
      } else {
        // const params = await NoPostActionsController.getActionMessage(inputValues)
        // await VkApiController.sendMessage(inputValues, params)
      }
    }
    const textError = "errorTask: Не было задания или поста";
    await ErrorActionController.sendAdminErrorAction(inputValues, textError);
    return ErrorMessagesController.getUserErrorMessage(inputValues);
  }
  private static async getPointsForLike(inputValues, post) {
    const like = await VkApiController.getLike(
      inputValues,
      post.owner_id,
      post.post_id
    );
    console.log(inputValues);
    console.log("like");
    console.log(like);
    if (!like) {
      console.log("like-fail");
      console.log(like);
      return 3;
    }
    return like.liked ? 3 : 0;
  }
  private static async getPointsForComment(inputValues, post) {
    let pointsForComments = 0;
    let errorComment = false;
    try {
      const comments = await VkApiController.getComments(
        inputValues,
        post.owner_id,
        post.post_id,
        0
      );
      if (comments) {
        const numberIterations = Math.ceil(comments.count / 100);
        for (let i = 0; i < numberIterations; i++) {
          let offset = i * 100;
          let commentsIteration = await VkApiController.getComments(
            inputValues,
            post.owner_id,
            post.post_id,
            offset
          );
          let itemCom = commentsIteration.items;
          for (const item of itemCom) {
            if (item.from_id === inputValues.peerId) {
              pointsForComments = await this.getPointsForText(
                pointsForComments,
                item.text
              );
            }
            const itemsThead = item.thread.items;
            for (const thread of itemsThead) {
              if (thread.from_id === inputValues.peerId) {
                pointsForComments = await this.getPointsForText(
                  pointsForComments,
                  thread.text
                );
              }
            }
          }
        }
      } else {
        pointsForComments = await this.getPointsForText(
          pointsForComments,
          "Очень круто)) так здорово написано)))!!!"
        );
      }
    } catch (e) {
      console.log(e);
      errorComment = true;
    }
    if (errorComment) {
      pointsForComments = await this.getPointsForText(
        pointsForComments,
        "Очень круто)) так здорово написано)))!!!"
      );
    }
    return pointsForComments;
  }
  public static async getPointsForText(pointsForComments, text) {
    let points = 0;
    if (text.length > 70) {
      points = 12;
    } else if (text.length > 30) {
      points = 9;
    } else if (text.length > 9) {
      points = 6;
    }
    return points > pointsForComments ? points : pointsForComments;
  }
  // У человека пустые задания
  private static async fakeComplete(inputValues) {
    const userCurrent = await UsersController.getUserById(inputValues);
    if (userCurrent) {
      userCurrent.points_all = userCurrent.points_all + 3;
      await userCurrent.save();
      const textError = "errorFake: У человека пустые задания";
      await ErrorActionController.sendAdminErrorAction(inputValues, textError);
      return 3;
    }
  }
  private static async checkStatusErrorCompleteTask(
    inputValues: any,
    task: Task,
    pointsForLike: number,
    pointsForComments: number
  ) {
    let params;
    switch (task.type) {
      case 0: // like + comment
        if (pointsForLike === 0 && pointsForComments === 0) {
          params = await TaskPointsFailMessages.getActionMessage(
            inputValues,
            "pointsLikeFailCommentsFail"
          );
        } else if (pointsForLike > 0 && pointsForComments === 0) {
          params = await TaskPointsFailMessages.getActionMessage(
            inputValues,
            "pointsLikeSuccessCommentsFail"
          );
        } else if (pointsForLike === 0 && pointsForComments > 0) {
          params = await TaskPointsFailMessages.getActionMessage(
            inputValues,
            "pointsLikeFailCommentsSuccess"
          );
        }
        break;
      case 1: // like
        if (pointsForLike === 0) {
          params = await TaskPointsFailMessages.getActionMessage(
            inputValues,
            "pointsLikeFail"
          );
        }
        break;
      case 2: //comment
        if (pointsForComments === 0) {
          params = await TaskPointsFailMessages.getActionMessage(
            inputValues,
            "pointsCommentsFail"
          );
        }
        break;
    }
    return params;
  }
  private static async setCompletedTask(inputValues: any, task: Task) {
    await TransactionsController.store(inputValues, task.current_post_id, 3, 1);
    await BufferTransactionsController.store(
      inputValues,
      task.current_post_id,
      3,
      1
    );
    const searchPayload = { user_id: inputValues.peerId };
    const persistancePayload = {
      current_post_id: 0,
    };
    return await TasksController.updateTask(
      inputValues,
      searchPayload,
      persistancePayload
    );
  }
}
