import HelpersController from "App/Controllers/Http/Bot/HelpersController";

const { stringify } = require("querystring");
import axios from "axios";
import User from "App/Models/Base/User";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import ErrorActionController from "App/Controllers/Http/Bot/Errors/Actions/ErrorActionController";

export default class VkApiController {
  public static async sendMessage(inputValues, request_params) {
    const method = "messages.send";
    let user_id;
    if (inputValues.peerId === 2000000001) {
      user_id = "";
    } else {
      user_id = inputValues.peerId;
    }
    const params: any = {
      message: request_params.message,
      attachment: request_params.attachment,
      peer_id: inputValues.peerId,
      user_id: user_id,
      keyboard: request_params.keyboard
        ? JSON.stringify(request_params.keyboard)
        : undefined,
      random_id: parseInt(
        Date.now().toString() + HelpersController.randomInteger(999, 99999999),
        10
      ),
      access_token: this.getToken(inputValues.configGroup),
    };
    // console.log(params)
    await this.sendRequest(method, params, inputValues);
  }
  // Получить информацию по юзеру
  public static async getUserInfo(inputValues) {
    const method = "users.get";
    const params: any = {
      user_ids: inputValues.peerId,
      access_token: this.getToken(inputValues.configGroup),
    };
    return await this.sendRequest(method, params, inputValues);
  }
  // Получение информации по посту
  public static async getPostById(inputValues, postId, zeroToken) {
    const token = zeroToken
      ? "grwagregerg"
      : await this.getUserTokenNew(inputValues);
    const method = "wall.getById";
    const params: any = {
      posts: postId,
      access_token: token,
    };
    console.log(999);
    console.log(params);
    return await this.sendRequest(method, params, inputValues);
  }
  // Проверяем является ли пользователь доном
  public static async checkUserDonat(inputValues, zeroToken) {
    const token = zeroToken
      ? "awefewfwef"
      : await this.getUserTokenNew(inputValues);
    const method = "donut.isDon";
    const params: any = {
      owner_id: inputValues.configGroup.groupId,
      access_token: token,
    };
    return await this.sendRequest(method, params, inputValues);
  }
  // Получение комментариев
  public static async getComments(inputValues, ownerId, postId, offset) {
    const method = "wall.getComments";
    const params: any = {
      owner_id: ownerId,
      post_id: postId,
      count: 100,
      thread_items_count: 10,
      offset: offset,
      access_token: await this.getUserTokenNew(inputValues),
    };
    let reqCom;
    try {
      reqCom = await this.sendRequest(method, params, inputValues);
    } catch (e) {
      console.log(e);
    }
    return reqCom;
  }
  // Получение лайка
  public static async getLike(inputValues, ownerId, postId) {
    const method = "likes.isLiked";
    const params: any = {
      user_id: inputValues.peerId,
      type: "post",
      owner_id: ownerId,
      item_id: postId,
      access_token: await this.getUserTokenNew(inputValues),
    };
    const test = await this.sendRequest(method, params, inputValues);
    return test;
  }
  // Получение списка, кто лайкнул пост
  public static async getList(inputValues, post) {
    const method = "likes.getList";
    const params: any = {
      type: "post",
      owner_id: post.owner_id,
      item_id: post.post_id,
      access_token: await this.getToken(inputValues.configGroup),
    };
    const test = await this.sendRequest(method, params, inputValues);
    return test;
  }
  // Получение короткой ссылки для юзертокена
  public static async getShortLink(configGroup, url) {
    const method = "utils.getShortLink";
    const params: any = {
      url: url,
      access_token: await this.getToken(configGroup),
    };
    return await this.sendRequest(method, params);
  }
  // Получение групп пользователя, где он руководитель
  public static async getGroupsAdmin(inputValues) {
    const method = "groups.get";
    const params: any = {
      user_id: inputValues.peerId,
      filter: "admin, editor, moder, advertiser",
      access_token: await this.getUserTokenNew(inputValues),
    };
    return await this.sendRequest(method, params, inputValues);
  }
  // лучение неответов
  public static async getUnansweredGo(inputValues, offset) {
    const method = "messages.getConversations";
    const params: any = {
      count: 50,
      offset: offset,
      filter: "unanswered",
      group_id: inputValues.configGroup.groupId,
      access_token: await this.getToken(inputValues.configGroup),
    };
    return await this.sendRequest(method, params, inputValues);
  }
  // получение последнеего сообщения пользоваля
  public static async getHistoryOneUser(inputValues, user_id) {
    const method = "messages.getHistory";
    const params: any = {
      count: 1,
      user_id: user_id,
      group_id: inputValues.configGroup.groupId,
      access_token: await this.getToken(inputValues.configGroup),
    };
    return await this.sendRequest(method, params, inputValues);
  }
  //проверка состоит ли человек в группе
  public static async checkGroupsIsMember(inputValues, token) {
    if (token === "") {
      token = await this.getUserTokenNew(inputValues);
    }
    const method = "groups.isMember";
    const params: any = {
      group_id: Number.parseInt(inputValues.configGroup.groupToСheck),
      user_id: inputValues.peerId,
      access_token: token,
      //'access_token': 'regwregreg',
    };
    return await this.sendRequest(method, params, inputValues);
  }
  // получаем айдишники всех человек в группе
  public static async getGroupMembers(
    inputValues,
    offset = 0,
    membersArray = []
  ) {
    const method = "groups.getMembers";
    const params: any = {
      group_id: Number.parseInt(inputValues.configGroup.groupToСheck),
      offset: offset,
      // 'access_token': await this.getUserTokenNew(inputValues),
      access_token: "egfreggerg",
    };
    const members = await this.sendRequest(method, params, inputValues);
    membersArray = membersArray.concat(members.items);
    if (members.items.length === 1000) {
      membersArray = await this.getGroupMembers(
        inputValues,
        offset + 1000,
        membersArray
      );
    }
    return membersArray;
  }
  public static async executeGetLikesAndComments(inputValues, code) {
    const method = "execute";
    const params: any = {
      code: code,
      //'access_token': 'regregerg',
      access_token: await this.getUserTokenNew(inputValues),
    };
    return await this.sendRequest(method, params, inputValues);
  }
  private static async sendRequest(method, params = {}, inputValues = {}) {
    let test;
    try {
      // @ts-ignore
      const { data } = await axios
        .post(
          `https://api.vk.com/method/${method}`,
          stringify({
            v: "5.103",
            ...params,
          }),
          { timeout: 2000 }
        )
        .then((response) => {
          if (response.data) {
            return response;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (data.error && data.error.error_code === 5) {
        await UsersController.getAgainUserAccessToken(inputValues);
        await UsersController.checkUser(inputValues);
        const textError = "errorToken: Просроченый токен";
        await ErrorActionController.sendAdminErrorAction(
          inputValues,
          textError
        );
        return false;
      }
      /*if (method === 'wall.getById') {
        console.log(method)
        console.log(params)
        console.log(data)
      }*/
      if (data.response) {
        test = data.response;
      } else {
        test = false;
      }
    } catch (e) {
      console.log(params);
      console.log("ИИИИБКАААА");
      console.log(e);
    }
    if (!test) {
      console.log("Битый токен");
      params["access_token"] = "regergerger";
    }
    try {
      // @ts-ignore
      const { data } = await axios
        .post(
          `https://api.vk.com/method/${method}`,
          stringify({
            v: "5.103",
            ...params,
          }),
          { timeout: 2000 }
        )
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
      if (data.response) {
        test = data.response;
      } else {
        console.log("Не приходят данные с ВК");
        test = false;
      }
    } catch (e) {
      console.log(params);
      console.log("ИИИИБКАААА");
      console.log(e);
    }
    return test;
  }
  private static getToken(configGroup) {
    const randomInteger = HelpersController.randomInteger(
      0,
      Object.keys(configGroup.token).length - 1
    );
    return configGroup.token[randomInteger];
  }
  private static async getUserTokenNew(inputValues) {
    User.connection = inputValues.configGroup.database;
    const user = await User.findBy("user_id", inputValues.peerId);
    if (user && user.user_token) {
      return user.user_token;
    }
    return "regergre";
  }

  public static async delay(t, val) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(val);
      }, t);
    });
  }
}
