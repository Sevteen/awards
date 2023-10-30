import ky from 'ky';

export interface CreateInstance {
  instance: typeof ky;
  controller: AbortController;
}

export interface ErrorApi {
  name: string;
  response?: {
    status?: number;
    statusText?: string;
  };
}
