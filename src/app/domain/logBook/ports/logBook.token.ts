import { InjectionToken } from '@angular/core';

import { LogBookServicePort } from './logBook.port';

export const LOG_BOOK_SERVICE = new InjectionToken<LogBookServicePort>(
    'LogBookServicePort'
);