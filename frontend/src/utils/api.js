class Api {
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

    getProfile() {

        return this._request('users/me', {
            method: "GET",
            headers: this._headers,
            credentials: 'include',
        });

    }

    editProfile(profile) {
        return this._request(`users/me`, {
            method: "PATCH",
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({
                name: profile.name,
                about: profile.about,
            })
        });
    }

    editAvatar(avatarLink) {
        return this._request(`users/me/avatar`, {
            method: "PATCH",
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({
                avatar: avatarLink,
            })
        });
    }

    getInitialCards() {
        return this._request(`cards`, {
            method: "GET",
            headers: this._headers,
            credentials: 'include',
        });
    }

    addCard(card) {
        return this._request(`cards`, {
            method: "POST",
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({
                name: card.name,
                link: card.link,
            })
        });
    }

    deleteCard(cardId) {
        return this._request(`cards/${cardId}`, {
            method: "DELETE",
            headers: this._headers,
            credentials: 'include',
        });
    }

    addLike(cardId) {
        return this._request(`cards/${cardId}/likes`, {
            method: "PUT",
            headers: this._headers,
            credentials: 'include',
        });
    }

    deleteLike(cardId) {
        return this._request(`cards/${cardId}/likes`, {
            method: "DELETE",
            headers: this._headers,
            credentials: 'include',
        });
    }

    changeCardLikeStatus(cardId, isLiked) {
        if (isLiked) {
            return this.deleteLike(cardId);
        } else {
            return this.addLike(cardId);
        }
    }
}

export const api = new Api({
    baseUrl: 'https://api.ivan.nomoreparties.co',
    headers: {
        'Content-Type': 'application/json',
    }
});
