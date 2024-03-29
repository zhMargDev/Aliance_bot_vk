import TasksActions from "App/Controllers/Http/Bot/Modules/Task/TasksActions";
import TextsController from "App/Controllers/Http/Bot/TextsController";
import User from "App/Models/Base/User";
import PostsController from "App/Controllers/Http/Bot/PostsController";

export default class TaskAllMessagesController {
  public static async getActionMessage(
    inputValues,
    type = "",
    replaceArray: any = {}
  ) {
    const ActionResponse = {
      message: "",
      attachment: "",
      keyboard: {},
    };
    const currentTask = await TasksActions.getCurrentTask(inputValues);
    if (!currentTask) {
      console.log("однако");
      return false;
    }
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    let points = 0;
    if (userCurrent) {
      points = userCurrent.points_all;
    }

    ActionResponse.message = "";
    if (
      !["436436435", "435435345", "436435643", "6432654354325"].includes(
        inputValues.configGroup.groupId
      )
    ) {
      ActionResponse.message = `🎱Общих баллов: ${points}`;
      ActionResponse.message =
        (await TextsController.getText(
          inputValues.configGroup,
          "points",
          currentTask.type
        )) +
        "\n" +
        ActionResponse.message;
    }
    const postById = await PostsController.getPostById(
      inputValues,
      currentTask.current_post_id
    );
    let attachmentUrl;
    if (postById) {
      attachmentUrl = `wall${postById.owner_id}_${postById.post_id}`;
    }
    switch (type) {
      case "noPost":
        ActionResponse.message =
          (await TextsController.getText(
            inputValues.configGroup,
            "tasks",
            "noPost"
          )) +
          "\n" +
          ActionResponse.message;
        break;
      case "skip":
        if (
          !["436436435", "435435345", "436435643", "6432654354325"].includes(
            inputValues.configGroup.groupId
          )
        ) {
          ActionResponse.message =
            (await TextsController.getText(
              inputValues.configGroup,
              "tasks",
              "skip"
            )) +
            "\n" +
            ActionResponse.message;
        }
        break;
      case "complete":
        ActionResponse.message =
          (await TextsController.getText(
            inputValues.configGroup,
            "tasks",
            "complete",
            replaceArray
          )) +
          "\n" +
          ActionResponse.message;
        break;
      case "pointsLikeFailCommentsFail":
      case "pointsLikeSuccessCommentsFail":
      case "pointsLikeFailCommentsSuccess":
      case "pointsLikeFail":
      case "pointsCommentsFail":
        ActionResponse.message =
          (await TextsController.getText(
            inputValues.configGroup,
            "pointsFail",
            type
          )) +
          "\n" +
          ActionResponse.message;
        break;
    }
    ActionResponse.attachment = attachmentUrl;
    if (
      !["436436435", "435435345", "436435643", "6432654354325"].includes(
        inputValues.configGroup.groupId
      )
    ) {
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "open_link",
                link: `https://vk.com/${attachmentUrl}`,
                label: "ПОКАЗАТЬ ПОСТ",
                payload: JSON.stringify({
                  url: `https://vk.com/${attachmentUrl}`,
                }),
              },
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TASKSKIP" },
                label: "✗ ПРОПУСТИТЬ",
              },
              color: "negative",
            },
            {
              action: {
                type: "text",
                payload: { TASK: "TASKCOMPLETE" },
                label: "✓ ОЦЕНЁН",
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "BACK" },
                label: "🔙 Вернуться",
              },
              color: "secondary",
            },
          ],
        ],
      };
    } else {
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "open_link",
                link: `https://vk.com/${attachmentUrl}`,
                label: "ПОКАЗАТЬ ПОСТ",
                payload: JSON.stringify({
                  url: `https://vk.com/${attachmentUrl}`,
                }),
              },
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TASKSKIP" },
                label: "✓ Далее",
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "BACK" },
                label: "🔙 Вернуться",
              },
              color: "secondary",
            },
          ],
        ],
      };
    }
    return ActionResponse;
  }
}
