//import Database from '@ioc:Adonis/Lucid/Database'
//import * as configGroups from 'App/Bot/Sources/vk/groups.json'
//import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class TenantDb {
  // @ts-ignore
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    //const tenantName = configGroups[ctx.request.input('group_id')].database
    //ctx.response.abortIf(!tenantName, 'Define tenant id using the query string')
    // You may fetch it from a master database
    /* const tenantConnectionConfig = {
      client: 'pg' as const,
      connection: {
        host: Env.get('DB_HOST', '127.0.0.1') as string,
        port: Number(Env.get('DB_PORT', 5432)),
        user: Env.get('DB_USER', 'tennant') as string,
        password: Env.get('DB_PASSWORD', 'tennant') as string,
        database: tenantName as string,
      },
    }

    const connectionName = tenantName

    if (!Database.manager.has(connectionName)) {
      Database.manager.add(connectionName, tenantConnectionConfig)
      Database.manager.connect(connectionName)
    } */
    await next();
  }
}
