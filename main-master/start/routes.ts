/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/api/v1/sep', 'Bot/InterlayersController.init')
Route.post('/api/v1/initUnanswered', 'Bot/InterlayersController.initUnanswered')

Route.get('/api/v1/auth/:group_id', 'Bot/UsersController.getUserAccessToken')

// Route.get('/api/v1/unanswered/:group_id', 'Modules/Task/UnansweredTaskController.UnansweredGoGo')

Route.get('/api/v1/unanswered/', 'Bot/Modules/Task/UnansweredTaskController.UnansweredGoGo')

Route.get('/api/v1/autocompleted/', 'Bot/AutoCompleteController.index')
Route.post('/api/v1/autocompleted/init/', 'Bot/AutoCompleteController.init')

Route.get('/api/v1/auto-buffer-delete/', 'Bot/AutoBufferController.init')

Route.get('/api/v1/stress/', 'Bot/StressController.init')
Route.get('/api/v1/stress/go', 'Bot/StressController.go')

// NotificationActivity
Route.get('/api/v1/notification-activity', 'Bot/NotificationActivityController.NotificationActivityGoGo')

Route.get('/api/v1/test/', 'Bot/PostsStatisticController.init')
Route.get('/api/v1/users-command/', 'Api/UsersApiController.userAndCommand')
Route.get('/api/v1/users-last-actives/', 'Api/UsersApiController.userLastActives')

/* Route
  .group(() => {
    Route.get('/init/day1', 'Modules/Desert/DesertClearDateActionsController.init')
  })
  .prefix('/desert')
*/
Route
  .group(() => {
    Route
      .group(() => {
        Route.get('groups/parents', 'Api/GroupsApiController.getParentGroups').as('api-v1-Parent')
        Route.get('groups/parents/:id', 'Api/GroupsApiController.getGroupByParentId').as('api-v1-ParentId')
        Route.get('groups/code/:code', 'Api/GroupsApiController.getGroupByCode').as('api-v1-CodeId')
        Route.resource('users', 'Api/UsersApiController')
        Route.resource('groups', 'Api/GroupsApiController')
        Route.get('posts/user/:id', 'Api/PostsApiController.getPostsByUserId').as('api-v1-PostByUserId')
        Route.resource('posts', 'Api/PostsApiController')
        Route.post('transactions/getByActionAndTypeLast14', 'Api/TransactionsApiController.getByActionAndTypeLast14').as('api-v1-transactions-getByActionAndTypeLast14')

        Route
          .group(() => {
            Route.get('posts/:id', 'Api/StatisticApiController.getPostById').as('api-v1-PostById')
            //Route.get('posts', 'Api/StatisticApiController.getPosts').as('api-v1-Posts')
          })
          .prefix('/statistic')
          .as('api-v1-statistic')
      })
      .prefix('/v1')
      .as('api-v1')
  })
  .prefix('/api')
  .middleware('auth')
  //.middleware('apiauth')
