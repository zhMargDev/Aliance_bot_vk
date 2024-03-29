import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import * as configGroups from "App/Bot/Sources/vk/groups.json";
import axios from "axios";
import User from "App/Models/Base/User";
import VkApiController from "App/Controllers/Http/Bot/Api/VkApiController";
import GetCodeAuthActionsController from "App/Controllers/Http/Bot/Modules/Token/Messages/GetCodeAuthActionsController";
import NoMemberMessagesController from "App/Controllers/Http/Bot/Modules/Other/Messages/NoMemberMessagesController";
import MainMenuMessages from "App/Controllers/Http/Bot/Modules/MainMenu/Messages/MainMenuMessages";
import TransactionsController from "App/Controllers/Http/Bot/TransactionsController";
import BufferTransactionsController from "App/Controllers/Http/Bot/BufferTransactionsController";
import HelpersController from "App/Controllers/Http/Bot/HelpersController";

export default class UsersController {
  public static async getUserAll(inputValues): Promise<any> {
    User.connection = inputValues.configGroup.database;
    return await User.all();
  }

  public static async getUserById(inputValues): Promise<any> {
    User.connection = inputValues.configGroup.database;
    return await User.findBy("user_id", inputValues.peerId);
  }

  public static async getUsersAllByStatus(inputValues, status): Promise<any> {
    User.connection = inputValues.configGroup.database;
    return await User.query().where("status", "=", status);
  }

  public static async getUsersAllByNotificationActivity(
    inputValues
  ): Promise<any> {
    User.connection = inputValues.configGroup.database;
    return await User.query().where("notification_activity", ">", 0);
  }

  // @ts-ignore
  public static async checkGroupsIsMember(
    inputValues,
    sendMessage = true
  ): Promise<any> {
    User.connection = inputValues.configGroup.database;
    let checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
      inputValues,
      ""
    );
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        "e6a7fceeba1e0802a4c038edcb7e431f229b6409a7cf1f43341b07eb054425152bb9dcbfd9305f50c7387"
      );
    }
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        ""
      );
    }
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        ""
      );
    }
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        "25a22a2d29ac98130952debe372aec4465b2e26890f3962e521cdfc81579821e05c218391cf7e8717f8f6"
      );
    }
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        ""
      );
    }
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        ""
      );
    }
    if (!checkGroupsIsMember) {
      checkGroupsIsMember = await VkApiController.checkGroupsIsMember(
        inputValues,
        "bd96e121bd96e121bd96e121ccbde4e36abbd96bd96e121e34148fb14fc5c3e6a11ac8d"
      );
    }
    if (!checkGroupsIsMember && sendMessage) {
      const params = await NoMemberMessagesController.getActionMessage(
        inputValues
      );
      await VkApiController.sendMessage(inputValues, params);
      return false;
    }
    if (!checkGroupsIsMember) {
      return false;
    }
    return true;
  }

  public static async checkUser(inputValues): Promise<any> {
    User.connection = inputValues.configGroup.database;
    let userCurrent = await this.getUserById(inputValues);
    if (!userCurrent) {
      userCurrent = await this.registerNewUser(inputValues);
    } else {
      if (!userCurrent.user_token) {
        const params = await GetCodeAuthActionsController.getActionMessage(
          inputValues.configGroup
        );
        await VkApiController.sendMessage(inputValues, params);
        return false;
      }
    }
    return userCurrent;
  }

  public static async checkUserDonat(inputValues): Promise<any> {
    return await VkApiController.checkUserDonat(inputValues, false);
  }

  public static async changePointsAll(inputValues, points) {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await this.getUserById(inputValues);
    userCurrent.points_all = userCurrent.points_all + points;
    await userCurrent.save();
    return userCurrent.$isPersisted;
  }

  public static async registerNewUser(inputValues) {
    const userInfo = await VkApiController.getUserInfo(inputValues);
    User.connection = inputValues.configGroup.database;
    const user = new User();
    user.user_id = inputValues.peerId;
    user.user_name = `${userInfo[0].first_name} ${userInfo[0].last_name}`;
    await user.save();
    if (user.$isPersisted) {
      await TransactionsController.store(inputValues, 0, 6, 1);
      const params = await GetCodeAuthActionsController.getActionMessage(
        inputValues.configGroup
      );
      await VkApiController.sendMessage(inputValues, params);
      return user;
    }
    return false;
  }

  public static async registerNewUserForDesert(inputValues) {
    const userInfo = await VkApiController.getUserInfo(inputValues);
    User.connection = inputValues.configGroup.database;
    const user = new User();
    user.user_id = inputValues.peerId;
    user.user_name = `${userInfo[0].first_name} ${userInfo[0].last_name}`;
    await user.save();
    if (user.$isPersisted && inputValues.configGroup.groupId !== "435623464363456") {
      // const params = await DesertActionsController.getActionUserRegisterMessage(inputValues)
      // await VkApiController.sendMessage(inputValues, params)
      return user;
    }
    return false;
  }

  public static async addInterest(inputValues): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      userCurrent.group_id = inputValues.payload.INTEREST;
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        return true;
      }
      return false;
    }
  }

  public static async changeBotStage(inputValues, botStage): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      userCurrent.bot_stage = botStage;
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        return true;
      }
      return false;
    }
  }

  public static async changeStatus(inputValues, status): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      userCurrent.status = status;
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        return true;
      }
      return false;
    }
  }

  public static async changeNumberPostsInList(
    inputValues,
    number_posts_in_list
  ): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      userCurrent.number_posts_in_list = number_posts_in_list;
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        return true;
      }
      return false;
    }
  }

  public static async changeNotificationActivity(
    inputValues,
    notification_activity
  ): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      userCurrent.notification_activity = notification_activity;
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        return true;
      }
      return false;
    }
  }

  public static async getBotStage(inputValues): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      return userCurrent.bot_stage;
    }
    return 0;
  }

  public static async changeStatusPriorityUser(inputValues): Promise<any> {
    const transactionsByUserId = await BufferTransactionsController.getByUserId(
      inputValues
    );
    let UserPointsForLastDay = 0;
    let LikesForLastDay;
    let CommentsForLastDay;
    if (
      inputValues.configGroup.groupId === "4354325432534" ||
      inputValues.configGroup.groupId === "4353425" ||
      inputValues.configGroup.groupId === "543543543"
    ) {
      LikesForLastDay = HelpersController.filterTransactionByItemAndThisDay(
        transactionsByUserId,
        1
      );
      CommentsForLastDay = HelpersController.filterTransactionByItemAndThisDay(
        transactionsByUserId,
        2
      );
    } else {
      LikesForLastDay = HelpersController.filterTransactionByItem(
        transactionsByUserId,
        1
      );
      CommentsForLastDay = HelpersController.filterTransactionByItem(
        transactionsByUserId,
        2
      );
    }
    LikesForLastDay.forEach((transaction) => {
      if (transaction.data) {
        // @ts-ignore
        UserPointsForLastDay = UserPointsForLastDay + transaction.data.points;
      }
    });
    CommentsForLastDay.forEach((transaction) => {
      if (transaction.data) {
        // @ts-ignore
        UserPointsForLastDay = UserPointsForLastDay + transaction.data.points;
      }
    });
    const dataChangeStatusPriorityUser =
      await BufferTransactionsController.getByAction(inputValues, 7);
    if (
      UserPointsForLastDay >=
        inputValues.configGroup.settings.points_for_status_vip &&
      dataChangeStatusPriorityUser === null
    ) {
      await TransactionsController.store(inputValues, 0, 7, 1);
      await BufferTransactionsController.store(inputValues, 0, 7, 1);
      await UsersController.changeStatus(inputValues, 2);
    } else if (
      UserPointsForLastDay >=
        inputValues.configGroup.settings.points_for_status_vip_top &&
      dataChangeStatusPriorityUser.length === 1
    ) {
      await TransactionsController.store(inputValues, 0, 7, 1);
      await BufferTransactionsController.store(inputValues, 0, 7, 1);
      await UsersController.changeStatus(inputValues, 3);
    } else if (dataChangeStatusPriorityUser === null) {
      await UsersController.changeStatus(inputValues, 1);
    }
    return true;
  }

  public static async getAgainUserAccessToken(inputValues): Promise<any> {
    User.connection = inputValues.configGroup.database;
    const userCurrent = await User.findBy("user_id", inputValues.peerId);
    if (userCurrent) {
      userCurrent.user_token =
        "4dde5c6995a80a3a01d9a5f484c3ea020f407b4880a2bbc5d56df37eeec5eb3f7e4589bf67c4ee8f41017";
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        return true;
      }
      return false;
    }
  }

  public async getUserAccessToken({
    request,
    response,
    params,
  }: HttpContextContract) {
    const group_id = params.group_id;
    const url = `https://oauth.vk.com/access_token?client_id=${
      configGroups[group_id].client_id
    }&client_secret=${
      configGroups[group_id].client_secret
    }&redirect_uri=https://api.weplex.app/api/v1/auth/${group_id}&code=${
      request.all().code
    }`;
    const { data } = await axios.get(url);
    User.connection = configGroups[group_id].database;
    const userCurrent = await User.findBy("user_id", data.user_id);
    if (userCurrent) {
      userCurrent.user_token = data.access_token;
      await userCurrent.save();
      if (userCurrent.$isPersisted) {
        const inputValues = {
          peerId: data.user_id,
          currentUser: userCurrent,
          configGroup: configGroups[group_id],
        };
        const params = await MainMenuMessages.getActionMessage(inputValues);
        await VkApiController.sendMessage(inputValues, params);
      }
    }
    response.redirect(`https://vk.com/im?sel=-${group_id}`);
  }
}
