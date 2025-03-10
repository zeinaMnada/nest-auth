import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    // switch to the commented code below to set up mongoose for production

    // ConfigModule.forRoot({
    //   envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load the appropriate .env file
    //   isGlobal: true, // Make the ConfigModule global
    // }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: `mongodb://${configService.get('DB_HOST')}:${configService.get('DB_PORT')}/${configService.get('DB_NAME')}`,
    //     user: configService.get('DB_USER'),
    //     pass: configService.get('DB_PASSWORD'),
    //     // uri: `mongodb+srv://${configService.get('DB_USER')}:${configService.get('DB_PASSWORD')}@${configService.get('DB_HOST')}/${configService.get('DB_NAME')}?retryWrites=true&w=majority`,
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     poolSize: 10, // Set the connection pool size
    //     ssl: process.env.NODE_ENV === 'production', // Enable SSL in production
    //     sslValidate: process.env.NODE_ENV === 'production', // Validate SSL certificate
    //     tlsAllowInvalidCertificates: false, // Do not allow invalid certificates
    //     retryAttempts: 5, // Retry connection attempts
    //     retryDelay: 3000, // Delay between retries
    //   }),
    //   inject: [ConfigService],
    // }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
