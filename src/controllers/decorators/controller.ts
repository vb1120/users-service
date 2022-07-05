import 'reflect-metadata'
import { AppRouter } from '../../utils'
import { asyncWrapp } from '../../middlewares'
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'

export function controller(prefix: string) {
    return function (target: Function) {
        // Getting router instance from AppRouter Singleton
        const router = AppRouter.getInstance()

        // Iterating over every function of controller class's object
        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            // Assigning the class object's function to a variable
            const routeHandler = asyncWrapp(target.prototype[key])
            // Getting metadata keys
            const path = Reflect.getMetadata(
                MetadataKeys.path,
                target.prototype,
                key
            )

            const method: Methods = Reflect.getMetadata(
                MetadataKeys.method,
                target.prototype,
                key
            )

            // If function has path metadata key execute the routeHandler
            if (path) router[method](`${prefix}${path}`, routeHandler)
        }
    }
}
