import { AppStorage, ItemExpiration } from './app-storage';
import { EXPIRY_TIME, UID } from './constant';

//todo
interface UserInformation {
  roles: number[];
}

export class Session {
  private userCache: UserInformation | null;

  constructor() {
    this.userCache = AppStorage.get<UserInformation>(UID);
  }

  getCurrentUser = (): UserInformation | null => {
    return this.userCache;
  };

  setCurrentUser = (user: UserInformation): void => {
    AppStorage.set<UserInformation & ItemExpiration>(UID, user, EXPIRY_TIME);
    this.userCache = user;
  };

  clearSession = (): void => {
    this.userCache = null;
    AppStorage.set(UID, null);
  };
}
