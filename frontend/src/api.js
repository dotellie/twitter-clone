/* globals fetch, location */
import { Notification } from 'element-ui';

export default class API {
  static get basePath () {
    return '//localhost:8080/api';
  }

  static async request (method, path, body) {
    const resp = await fetch(this.basePath + path, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    });

    if (!resp.ok) {
      throw await resp.json();
    }

    const respBody = await resp.json();

    if (respBody.message) {
      Notification({
        title: 'Information',
        message: respBody.message
      });
    }

    if (respBody.status === 'ok') {
      return respBody;
    } else if (respBody.status === 'unathenticated') {
      location.pathname = '/';
    } else {
      throw respBody;
    }
  }

  static get (path) {
    return this.request('GET', path);
  }

  static post (path, body) {
    return this.request('POST', path, body);
  }

  static del (path) {
    return this.request('DELETE', path);
  }
}
