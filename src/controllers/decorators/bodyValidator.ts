import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'
import { RouteHandlerDescriptor } from './routes'

// This custom decorator takes dto class as an argument and defines it as metadata key
export function bodyValidator(DtoClass: Function) {
    return function (
        target: typeof Object.prototype,
        key: string,
        desc: RouteHandlerDescriptor
    ) {
        Reflect.defineMetadata(MetadataKeys.validator, DtoClass, target, key)
    }
}
