import type {AxiosInstance, Method} from 'axios';
import axios from 'axios';
import {getQueryParam} from "@/utilities/utils";
import loaderService from "@/services/loader-service";

class InterceptorService {
    instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_PWA_API_DOMAIN });
        this.interceptRequest();
    }

    get defaultHeaders() {
        const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
        let accessToken: string | null = getQueryParam('accessToken');

        if (!accessToken) {
            accessToken = localStorage.getItem('accessToken') ?? '';
            if (!accessToken) {
                window.location.href = '/';
                return;
            }
        }

        localStorage.setItem('accessToken', accessToken);
        headers['Authorization'] = `Bearer ${accessToken}`;

        return headers;
    }

    private interceptRequest() {
        this.instance.interceptors.request.use(
            (config: any) => config,
            (error: any) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response: any) => response,
            (error: any) => {
                if (error?.response?.status === 401) {
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        );
    }

    async request(method: Method, url: string, data = null, customHeaders = {}) {
        const headers = { ...this.defaultHeaders, ...customHeaders };
        const source = axios.CancelToken.source();

        const config: any = {
            method,
            url,
            headers,
            cancelToken: source.token
        };

        if (data) {
            config.data = data;
        }

        try {
            loaderService.showLoader(true);
            return await this.instance(config);
        } catch (error: any) {
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return;
            }
            throw error;
        }
        finally {
            loaderService.showLoader(false);
        }
    }
}

const interceptorService = new InterceptorService();

export default interceptorService;
