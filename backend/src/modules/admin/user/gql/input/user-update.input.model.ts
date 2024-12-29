import { InputType, OmitType } from '@nestjs/graphql';
import { UserCreateInput } from './user-create.input.model';

@InputType()
export class UserUpdateInput extends OmitType(UserCreateInput, ['password']) {}
