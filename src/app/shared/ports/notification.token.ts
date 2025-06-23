import { InjectionToken } from '@angular/core';

import { NotificationPort } from './notification.port';

export const NOTIFICATION_PORT = new InjectionToken<NotificationPort>(
  'NotificationPort'
);
