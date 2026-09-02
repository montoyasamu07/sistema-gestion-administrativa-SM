import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import hbs from 'hbs';
import { AppModule } from './app.module';
import { formatDate, formatMoney } from './common/format';
import { NotFoundExceptionFilter } from './common/not-found.filter';

async function bootstrap() {
  mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const viewsPath = join(__dirname, '..', 'views');
  const publicPath = join(__dirname, '..', 'public');

  app.useStaticAssets(publicPath);
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'layouts/main' });

  hbs.registerPartials(join(viewsPath, 'partials'));
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  hbs.registerHelper('money', (value: number) => formatMoney(value));
  hbs.registerHelper('date', (value: string) => formatDate(value));
  hbs.registerHelper('active', (current: string, path: string) =>
    current === path ? 'active' : '',
  );
  hbs.registerHelper('estadoClass', (estado: string) =>
    estado === 'completada' ? 'badge-success' : 'badge-warning',
  );
  hbs.registerHelper('prioridadClass', (prioridad: string) => {
    if (prioridad === 'Alta') return 'badge-danger';
    if (prioridad === 'Baja') return 'badge-muted';
    return 'badge-info';
  });
  hbs.registerHelper('tipoClass', (tipo: string) =>
    tipo === 'Ingreso' ? 'text-success' : 'text-danger',
  );
  hbs.registerHelper('balanceClass', (value: number) =>
    Number(value) >= 0 ? 'positive' : 'negative',
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Hotel Bucaro disponible en http://localhost:${port}`);
}

bootstrap();
