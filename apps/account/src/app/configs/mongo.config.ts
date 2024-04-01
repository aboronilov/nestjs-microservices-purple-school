import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
    return {
        useFactory: (configService: ConfigService) => ({
            uri: getMongoURI(configService)
        }),
        inject: [ConfigService],
        imports: [ConfigModule]
    }
}

const getMongoURI = (configService: ConfigService): string => {
    const MONGO_LOGIN = configService.get("MONGO_LOGIN")
    const MONGO_PASSWORD = configService.get("MONGO_PASSWORD")
    const MONGO_HOST = configService.get("MONGO_HOST")
    const MONGO_PORT = configService.get("MONGO_PORT")
    const MONGO_DATABASE = configService.get("MONGO_DATABASE")
    const MONGO_AUTHDATABASE = configService.get("MONGO_AUTHDATABASE")

    const URI = `mongodb://${MONGO_LOGIN}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=${MONGO_AUTHDATABASE}`

    return URI
}