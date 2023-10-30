/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import ky, { Options, HTTPError } from 'ky';
import { CreateInstance, ErrorApi } from './api.type';
import { config } from './config';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@utils/lib';

export class ApiService {
  private refreshing: boolean;
  constructor(private defaultOptions: Options) {
    this.refreshing = false;
  }

  createInstance(): CreateInstance {
    const controller = new AbortController();
    const signal = controller.signal;

    const instance = ky.create({
      prefixUrl: config.API_URL,
      timeout: false,
      signal,
      credentials: 'include',
      hooks: {
        afterResponse: [
          async (request: any, options: any, response: any) => {
            return response;
          },
        ],
      },
      ...this.defaultOptions,
    });

    return { instance, controller };
  }

  private interceptRequest = async () => {
    if (!this.refreshing && this.isTokenExpired()) {
      this.refreshing = true;
      const { instance, controller } = this.createInstance();

      const refreshToken = (await instance.get('refresh')) as any;
      if (refreshToken.status !== 'OK') {
        localStorage.clear();
        window.location.replace('/login');
      }
      this.refreshing = false;
    }
  };

  private isTokenExpired() {
    const jwtAuth = getCookie('Authentication');
    if (!jwtAuth) {
      localStorage.clear();
      return true;
    }
    const jwtDecoded = jwtDecode(jwtAuth);
    const now = Math.floor(Date.now() / 1000);

    if (jwtDecoded && jwtDecoded.exp && jwtDecoded.exp < now) {
      localStorage.clear();
      return true;
    }

    return false;
  }

  //todo user autorization headers
  private getHeaders(): Options['headers'] {
    let headers: Options['headers'];
    const user = null;
    if (user) {
      headers = {
        Authorization: user,
      };
    }

    return headers;
  }

  //todo headers
  async get<T>(endpoint: string, searchParams: Record<string, any> = {}, checkToken = true) {
    let headers;
    const { instance, controller } = this.createInstance();

    if (checkToken) this.interceptRequest();

    try {
      const response = await instance.get(endpoint, { searchParams, headers }).json<T>();
      return response;
    } catch (error: any) {
      this.onErrorHandle(error as ErrorApi);
      return error.response.json() as any;
    }
  }

  async post<T = any>(endpoint: string, payload: any = {}, checkToken = true): Promise<T> {
    let headers;
    const { instance, controller } = this.createInstance();
    console.log(checkToken);
    if (checkToken) this.interceptRequest();

    try {
      const response = await instance.post(endpoint, { json: payload, headers }).json<T>();
      return response;
    } catch (error: any) {
      return error.response.json() as any;
    }
  }

  private onErrorHandle(error: ErrorApi) {
    //todo error handle api
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    } else if (error.response) {
      const { status } = error.response;
      const message = error.response.statusText || 'Unknown error';
      return { code: status, message, status: 'error' };
    } else {
      return { code: -1, message: 'Network error', status: 'error' };
    }
  }
}
