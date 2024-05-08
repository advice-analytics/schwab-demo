import interceptorService from './interceptor-service';

class HTTPService {
    get(url: string, customHeaders = {}): Promise<any> {
        return interceptorService.request('get', url, null, customHeaders);
    }

    post(url: string, data: any, customHeaders = {}): Promise<any> {
        return interceptorService.request('post', url, data, customHeaders);
    }

    put(url: string, data: any, customHeaders = {}): Promise<any> {
        return interceptorService.request('put', url, data, customHeaders);
    }

    delete(url: any, customHeaders = {}): Promise<any> {
        return interceptorService.request('delete', url, null, customHeaders);
    }

    patch(url: string, data: any, customHeaders = {}): Promise<any> {
        return interceptorService.request('patch', url, data, customHeaders);
    }
}

const httpService = new HTTPService();

export default httpService;
