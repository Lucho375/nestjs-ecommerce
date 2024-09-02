import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';
import * as path from 'path';

@Injectable()
export class TemplateService {
  private async loadTemplate(templateName: string): Promise<string> {
    try {
      const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
      return fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al cargar la plantilla de email',
      );
    }
  }

  async compileTemplate<T = any>(
    templateName: string,
    context: T,
  ): Promise<string> {
    try {
      const templateContent = await this.loadTemplate(templateName);
      const template = handlebars.compile(templateContent);
      return template(context);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al compilar la plantilla de email',
      );
    }
  }
}
