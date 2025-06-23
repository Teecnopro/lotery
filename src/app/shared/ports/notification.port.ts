export abstract class NotificationPort {
  abstract success(summary: string): void;
  abstract error(summary: string): void;
  abstract info(summary: string): void;
  abstract warn(summary: string): void;
}
