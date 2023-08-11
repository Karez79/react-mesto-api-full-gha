class Auth {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    _checkRes(res) {
        if (res.ok) {
            return res.json();
        }

        // если ошибка, отклоняем промис
        return Promise.reject(new Error(`Ошибка: ${res.status}`));
    }

    _request(endpoint, options) {
        const url = `${this._baseUrl}/${endpoint}`;
        return fetch(url, options).then(this._checkRes);
    }

    signup(profile) {
        return this._request(`signup`, {
            method: "POST",
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({
                password: profile.password,
                email: profile.email,
            })
        });
    }

    getUser() {
        return this._request(`users/me`, {
            method: "GET",
            credentials: 'include',
            headers: {
                ...this._headers,
            },
        });
    }

    signin(profile) {
        console.log(this._headers);
        return this._request(`signin`, {
            method: "POST",
            headers: {
                ...this._headers,
            },
            credentials: 'include',
            body: JSON.stringify({
                password: profile.password,
                email: profile.email,
            })
        });
    }
}

export const auth = new Auth({
    baseUrl: 'https://api.ivan.nomoreparties.co',
    headers: {
        'Content-Type': 'application/json',
    }
});
