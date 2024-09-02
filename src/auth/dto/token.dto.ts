import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
