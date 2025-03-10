import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string,
  readonly name: string,
  readonly password: string,
}