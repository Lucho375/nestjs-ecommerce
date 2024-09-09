import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

class WebhookDataDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class WebhookDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  api_version: string;

  @IsObject()
  data: WebhookDataDto;

  @IsDateString()
  date_created: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  live_mode: boolean;

  @IsString()
  type: string;

  @IsNumber()
  user_id: number;
}
