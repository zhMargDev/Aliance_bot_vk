import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import * as configGroups from "App/Bot/Sources/vk/groups.json"; //tsconfig.ts "resolveJsonModule": true,
import GoQueue from "App/Jobs/GoQueue";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import TasksActions from "App/Controllers/Http/Bot/Modules/Task/TasksActions";
import MapActionsController from "App/Controllers/Http/Bot/Messages/MapActionsController";
import VkApiController from "App/Controllers/Http/Bot/Api/VkApiController";
import StopChatAction from "App/Controllers/Http/Bot/Modules/Support/Actions/StopChatAction";
import MainMenuMessages from "App/Controllers/Http/Bot/Modules/MainMenu/Messages/MainMenuMessages";
import SupportMessages from "App/Controllers/Http/Bot/Modules/Support/Messages/SupportMessages";
import PostsController from "App/Controllers/Http/Bot/PostsController";
import GoQueueNau from "App/Jobs/GoQueueNau";
import DonatController from "./Modules/Other/Messages/DonatController";
import ChangeNumberPostsInListController from "./Modules/Other/Messages/ChangeNumberPostsInListController";
import NotificationActivityMessages from "./Modules/Other/Messages/NotificationActivityMessages";

export default class InterlayersController {
  public async init({ request }: HttpContextContract) {
    const requestAll = request.all();
    const configGroup = configGroups[requestAll.group_id];
    if (!configGroup) {
      return "error";
    }
    switch (requestAll.type) {
      case "confirmation":
        return configGroup.confirmation;
      case "message_reply":
        return "ok";
      default:
        break;
    }
    if (requestAll.group_id !== 193411179) {
      console.log("Init.All");
      GoQueue.goJob(request.all());
    } else {
      console.log("Init.Nau");
      GoQueueNau.goJob(request.all());
    }
    return "ok";
  }

  public async initUnanswered({ request }: HttpContextContract) {
    const requestAll = request.all();
    const configGroup = configGroups[requestAll.group_id];
    if (!configGroup) {
      return "error";
    }
    switch (requestAll.type) {
      case "confirmation":
        return configGroup.confirmation;
      default:
        break;
    }
    if (requestAll.group_id !== 193411179) {
      console.log("Init.All");
      GoQueue.goJob(request.all());
    } else {
      console.log("Init.Nau.Un");
      GoQueueNau.goJob(request.all());
    }
    return "ok";
  }

  public static async index(request: any) {
    const configGroup = configGroups[request.group_id];
    if (!configGroup) {
      return "error";
    }
    switch (request.type) {
      case "message_new":
        return this.messageNew(request, configGroup);
      case "message_reply":
        return this.replyNew(request, configGroup);
      default:
        break;
    }
  }

  private static async messageNew(request, configGroup) {
    const payload = request.object.message.payload;
    const inputValues = {
      idMessage: request.object.message.id,
      text: request.object.message.text,
      attachments: request.object.message.attachments,
      payload: payload ? JSON.parse(payload) : "",
      peerId: request.object.message.peer_id,
      configGroup: configGroup,
      currentUser: null,
    };
    if (inputValues.peerId === 1111111111111111111) {
      console.log(inputValues.peerId);
      console.time("FinishTestTime");
      console.log("-----------------");
    }
    if (inputValues.peerId === 2000000001) {
      return false;
    }
    if (
      inputValues.configGroup.groupId === "3252352354" &&
      !(await UsersController.checkUserDonat(inputValues))
    ) {
      const params = await DonatController.getActionMessage();
      if (params) {
        await VkApiController.sendMessage(inputValues, params);
      }
      return false;
    }
    inputValues.currentUser = await UsersController.checkUser(inputValues); // есть ли пользователь в базе
    if (!inputValues.currentUser) {
      return false;
    }
    if (
      inputValues.configGroup.groupId === "325325231" ||
      inputValues.configGroup.groupId === "3243243253215" ||
      inputValues.configGroup.groupId === "435345345"
    ) {
      const checkGroupsIsMember = await UsersController.checkGroupsIsMember(
        inputValues
      ); // состоит ли пользователь в группе
      if (!checkGroupsIsMember) {
        return false;
      }
    }
    // Проверяем открыт ли чат с пользователем
    let stop = false;
    if (inputValues.payload.CHATBOT !== "BACK") {
      const getBotStage = await UsersController.getBotStage(inputValues);
      if (Number.parseInt(getBotStage) === 11) {
        stop = true;
      } else if (Number.parseInt(getBotStage) === 10) {
        const params = await SupportMessages.getActionMessage(
          inputValues,
          "admin_notification"
        );
        if (params) {
          await UsersController.changeBotStage(inputValues, 11);
          inputValues.peerId = configGroup.notificationChatId;
          await VkApiController.sendMessage(inputValues, params);
        }
        stop = true;
      }
    }
    // Обрабатываем команду
    if (!stop) {
      let params;
      if (await PostsController.checkLinkPost(inputValues)) {
        params = await TasksActions.AddTask(inputValues);
      } else if (
        inputValues.text.includes("посты:") ||
        inputValues.text.includes("Посты:")
      ) {
        let text = inputValues.text.split(":");
        let number_posts_in_list = Number.parseInt(text.pop());
        let params;
        if (number_posts_in_list > 1 && number_posts_in_list < 31) {
          UsersController.changeNumberPostsInList(
            inputValues,
            number_posts_in_list
          );
          params = await ChangeNumberPostsInListController.getActionMessage();
        } else {
          params =
            await ChangeNumberPostsInListController.getActionErrorMessage();
        }
        if (params) {
          await VkApiController.sendMessage(inputValues, params);
        }
      } else if (
        inputValues.text.includes("напоминалка:") ||
        inputValues.text.includes("напоминание:") ||
        inputValues.text.includes("Напоминалка:") ||
        inputValues.text.includes("Напоминание:")
      ) {
        let text = inputValues.text.split(":");
        let notification = Number.parseInt(text.pop());
        let params;
        if (notification === 0) {
          UsersController.changeNotificationActivity(inputValues, notification);
          params = await NotificationActivityMessages.getActionZeroMessage();
        } else if (notification > 0 && notification < 8) {
          UsersController.changeNotificationActivity(inputValues, notification);
          params = await NotificationActivityMessages.getActionMessage();
        } else {
          params = await NotificationActivityMessages.getActionErrorMessage();
        }
        if (params) {
          await VkApiController.sendMessage(inputValues, params);
        }
      } else {
        params = await MapActionsController.getAction(inputValues);
      }
      if (params) {
        await VkApiController.sendMessage(inputValues, params);
        if (inputValues.peerId === 1111111111111111111) {
          console.timeEnd("ААА :)");
          console.timeEnd("FinishTestTime");
        }
      }
    }
  }

  private static async replyNew(request, configGroup) {
    const inputValues = {
      text: request.object.text,
      peerId: request.object.peer_id,
      configGroup: configGroup,
    };
    const checkChatCommand = await StopChatAction.checkChatCommand(inputValues);
    if (checkChatCommand && inputValues.peerId !== 2000000001) {
      const paramsOne = await SupportMessages.getActionMessage(
        inputValues,
        checkChatCommand
      );
      if (paramsOne) {
        await VkApiController.sendMessage(inputValues, paramsOne);
      }
      const currentUser = await UsersController.getUserById(inputValues);
      if (currentUser) {
        let params;
        if (checkChatCommand === "stop_admin" && currentUser.user_token) {
          params = await MainMenuMessages.getActionMessage(inputValues);
        }
        if (params) {
          await VkApiController.sendMessage(inputValues, params);
        }
      }
    }
  }
}
