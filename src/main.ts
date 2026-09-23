import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import hbs from 'hbs';
import { AppModule } from './app.module';
import { formatDate, formatMoney } from './common/format';
import { NotFoundExceptionFilter } from './common/not-found.filter';

let cachedApp: NestExpressApplication;

export async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  if (!process.env.VERCEL) {
    const localDataDir = join(process.cwd(), 'data');
    if (!existsSync(localDataDir)) {
      try {
        mkdirSync(localDataDir, { recursive: true });
      } catch {
        // Ignorar
      }
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const rootDir = process.cwd();
  const viewsPath = existsSync(join(rootDir, 'views'))
    ? join(rootDir, 'views')
    : join(__dirname, '..', 'views');
  const publicPath = existsSync(join(rootDir, 'public'))
    ? join(rootDir, 'public')
    : join(__dirname, '..', 'public');

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

  // Middleware para garantizar que las redirecciones en Vercel Serverless usen 303 (See Other)
  // por defecto en lugar de 307 (Temporary Redirect), lo que previene bucles de redirección
  // infinitos (ERR_TOO_MANY_REDIRECTS) en peticiones POST al seguir el patrón Post/Redirect/Get.
  app.use((_req: any, res: any, next: any) => {
    const originalRedirect = res.redirect.bind(res);
    res.redirect = function (first: any, second?: any) {
      const safeEncode = (url: string) => {
        try {
          return encodeURI(decodeURI(url));
        } catch {
          return encodeURI(url);
        }
      };

      if (typeof first === 'string') {
        return originalRedirect(303, safeEncode(first));
      }
      if (typeof first === 'number' && typeof second === 'string') {
        return originalRedirect(first, safeEncode(second));
      }
      return originalRedirect(first, second);
    };
    next();
  });

  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.init();
  cachedApp = app;
  return app;
}

let serverPromise: Promise<any> | null = null;

// Handler serverless para Vercel
export default async function handler(req: any, res: any) {
  const originalVercelRedirect = res.redirect?.bind(res);
  if (originalVercelRedirect) {
    res.redirect = function (first: any, second?: any) {
      const safeEncode = (url: string) => {
        try {
          return encodeURI(decodeURI(url));
        } catch {
          return encodeURI(url);
        }
      };
      if (typeof first === 'string') {
        return originalVercelRedirect(303, safeEncode(first));
      }
      if (typeof first === 'number' && typeof second === 'string') {
        return originalVercelRedirect(first, safeEncode(second));
      }
      return originalVercelRedirect(first, second);
    };
  }

  if (!serverPromise) {
    serverPromise = createApp().then((app) => app.getHttpAdapter().getInstance());
  }
  const expressInstance = await serverPromise;
  return expressInstance(req, res);
}

// Servidor local tradicional
if (!process.env.VERCEL) {
  createApp().then(async (app) => {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Hotel Bucaro disponible en http://localhost:${port}`);
  });
}

