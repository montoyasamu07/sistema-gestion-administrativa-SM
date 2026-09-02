import { Injectable } from '@nestjs/common';

@Injectable()
export class LayoutService {
  context(currentPath: string, extra: Record<string, unknown> = {}) {
    return {
      appName: 'Hotel Bucaro',
      appSubtitle: 'Gestión administrativa',
      currentPath,
      year: new Date().getFullYear(),
      ...extra,
    };
  }
}
