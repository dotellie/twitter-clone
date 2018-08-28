/* globals fetch, location */
import { Notification } from 'element-ui';

export default class API {
  static get basePath () {
    // TODO: change path and credentials
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
      credentials: 'include'
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
      this.setUser();
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

  static setUser (user) {
    if (!user) {
      window.localStorage.removeItem('currentUser');
    } else {
      window.localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  static getUser () {
    return JSON.parse(window.localStorage.getItem('currentUser'));
  }
}

window.API = API;
