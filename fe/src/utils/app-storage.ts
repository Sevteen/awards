import { addCurrentTimeWithNumericTime, compareDates } from '.';

export interface ItemExpiration {
  expiredOn?: string;
}

export class AppStorage {
  static get<T>(key: string): T | null {
    const saved = localStorage.getItem(key);
    if (!saved) {
      return null;
    }
    const item = JSON.parse(saved) as ItemExpiration;

    if (item.expiredOn && compareDates(item.expiredOn, new Date())) {
      localStorage.removeItem(key);
      return null;
    }

    return item as T;
  }

  static set<T>(key: string, item: T, expiry?: Date | number): void {
    let expiredOn: Date | null = null;
    if (expiry instanceof Date) {
      expiredOn = expiry as Date;
    } else if (expiry) {
      expiredOn = addCurrentTimeWithNumericTime(expiry);
    }

    localStorage.setItem(key, JSON.stringify({ ...item, expiredOn }));
  }
}
