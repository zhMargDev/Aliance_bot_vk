import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import PostApi from 'App/Models/Api/PostApi'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import MessageAfterAddPostApiMessages from 'App/Controllers/Http/Bot/Messages/MessageAfterAddPostApiMessages'
import GroupsController from 'App/Controllers/Http/Bot/GroupsController'
import UsersController from 'App/Controllers/Http/Bot/UsersController'
import TransactionsController from 'App/Controllers/Http/Bot/TransactionsController'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'
import PostsController from 'App/Controllers/Http/Bot/PostsController'
import {DateTime} from 'luxon'
import UsersInfoController from "App/Controllers/Http/Bot/UsersInfoController";

export default class PostsApiController {
  public async index ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      PostApi.connection = configGroups[group].database
      const posts = await PostApi.all()
      const thisTime = DateTime.local()
      const lifetimePost = thisTime.minus({ hours:  configGroups[group].settings.lifetime_post })
      posts.forEach((post) => {
        if (post.status === 2 || post.status === 3 || post.status === 4) {
          post.status = 1
        }
        if (post.createdAt < lifetimePost) {
          post.status = 0
        }
      })
      return posts
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
  public async show ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      PostApi.connection = configGroups[group].database
      return await PostApi.findByOrFail('id', params.id)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async getPostsByUserId ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      PostApi.connection = configGroups[group].database
      const posts = await PostApi
        .query()
        .where('user_id', params.id)
      const thisTime = DateTime.local()
      const lifetimePost = thisTime.minus({ hours:  configGroups[group].settings.lifetime_post })
      posts.forEach((post) => {
        if (post.status === 2 || post.status === 3 || post.status === 4) {
          post.status = 1
        }
        if (post.createdAt < lifetimePost) {
          post.status = 0
        }
      })
      return posts
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async store ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    const allowedParams = ['user_id', 'group_id', 'type', 'owner_id', 'post_id', 'status', 'stop_like']
    if (group) {
      const params = request.all()
      const inputValues = {
        // @ts-ignore
        'peerId': params.user_id,
        'configGroup': configGroups[group],
        code: null,
      }
      if (params.id) {
        const currentPost = await PostsController.getPostById(inputValues, params.id)
        if (!currentPost) {
          return response.status(400).send('NO_POST')
        }
        if (!params.user_id) {
          inputValues.peerId = currentPost.user_id
        }
        PostApi.connection = configGroups[group].database
        const searchPayload = { id: params.id }
        const savePayload = {}
        for (let param in params) {
          if (allowedParams.includes(param)) {
            savePayload[param] = params[param]
          }
        }
        if (params['group_code']) {
          inputValues.code = params['group_code']
          const groupByCode = await GroupsController.getGroupByCode(inputValues)
          savePayload['group_id'] = groupByCode.serialize().id
        }
        if (!savePayload['group_id'] && inputValues.peerId) {
          const currentUser = await UsersController.getUserById(inputValues)
          savePayload['group_id'] = currentUser.group_id
        }
        await TransactionsController.store(inputValues, params.id, 9, 3)
        if (params.text_adding_post && inputValues.peerId) {
          const paramsMessage = await MessageAfterAddPostApiMessages.getActionMessage(params.text_adding_post)
          await VkApiController.sendMessage(inputValues, paramsMessage)
        }
        return await PostApi.updateOrCreate(searchPayload, savePayload)
      } else {
        const currentPost = await PostsController.getPostByOwnerIdAndPostId(inputValues, params.owner_id, params.post_id)
        if (currentPost.length > 0) {
          response.status(400).send('E_POST_ALREADY_EXIST')
          return
        }
        PostApi.connection = configGroups[group].database
        const postApi = new PostApi()
        if (!params['stop_like'] || params['stop_like'] < 0 || params['stop_like'] > 999999999) {
          params['stop_like'] = 999999999
        }
        for (let param in params) {
          if (allowedParams.includes(param)) {
            postApi[param] = params[param]
          }
        }
        if (params['group_code']) {
          inputValues.code = params['group_code']
          const groupByCode = await GroupsController.getGroupByCode(inputValues)
          postApi['group_id'] = groupByCode.serialize().id
        }
        if (!postApi['group_id'] && params.user_id) {
          const currentUser = await UsersController.getUserById(inputValues)
          postApi['group_id'] = currentUser.group_id
        }
        await postApi.save()
        if (postApi.$isPersisted) {
          await UsersInfoController.changeValue(inputValues, 'added')
          await TransactionsController.store(inputValues, postApi.id, 5, 3)
          await BufferTransactionsController.store(inputValues, postApi.id, 5, 3)
          if (params.text_adding_post && params.user_id) {
            const paramsMessage = await MessageAfterAddPostApiMessages.getActionMessage(params.text_adding_post)
            await VkApiController.sendMessage(inputValues, paramsMessage)
          }
          return postApi
        }
        return 'error'
      }
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
}
