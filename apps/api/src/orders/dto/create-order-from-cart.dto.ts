import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderFromCartDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;
}