import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(_exception: NotFoundException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(404).render('errors/404', {
      layout: 'layouts/main',
      appName: 'Hotel Bucaro',
      appSubtitle: 'Gestión administrativa',
      currentPath: '',
      title: 'Página no encontrada',
      year: new Date().getFullYear(),
    });
  }
}
