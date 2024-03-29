import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { AuthenticationException } from "@adonisjs/auth/build/standalone";
import * as configGroups from "App/Bot/Sources/vk/groups.json";
import User from "App/Models/User";
import Authtenants from "App/Models/Base/Authtenants";

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to when request is Unauthorized
   */
  protected redirectTo = "/login";

  /**
   * Authenticates the current HTTP request against a custom set of defined
   * guards.
   *
   * The authentication loop stops as soon as the user is authenticated using any
   * of the mentioned guards and that guard will be used by the rest of the code
   * during the current request.
   */
  protected async authenticate(
    auth: HttpContextContract["auth"],
    guards: string[]
  ) {
    /*const email = 'email@email.click'
    const password = 'pass'
    let token
    console.log(555)
    try {
      token = await auth.use('api').attempt(email, password)
      console.log(token)
    } catch (e) {
      console.log(e)
    }*/
    /*Authtenants.connection = 'tenants'
    const user = new Authtenants()
    user.email = 'email@email.click'
    user.password = 'pass'
    const token = await user.save()*/
    //console.log(token)
    for (let guard of guards) {
      // @ts-ignore
      if (
        (await auth.use(guard).check()) &&
        auth.user.email ===
          configGroups[auth.ctx.request.request.headers.group].email_tenant
      ) {
        // Instruct auth to use the given guard as the default guard for
        // the rest of the request, since the user authenticated
        // succeeded here
        auth.defaultGuard = guard;
        return true;
      }
    }

    /**
     * Unable to authenticate using any guard
     */
    throw new AuthenticationException(
      "Unauthorized access",
      "E_UNAUTHORIZED_ACCESS",
      this.redirectTo
    );
  }

  /**
   * Handle request
   */
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: string[]
  ) {
    /**
     * Uses the user defined guards or the default guard mentioned in
     * the config file
     */
    const guards = customGuards.length ? customGuards : [auth.name];
    await this.authenticate(auth, guards);
    await next();
  }
}
