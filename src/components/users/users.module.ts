import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema from './schemas/users.schema';
import UsersController from './users.controller';
import UsersService from './users.service';
import usersConstants from './users.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: usersConstants.models.users,
      schema: UserSchema,
    }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export default class UsersModule {}
