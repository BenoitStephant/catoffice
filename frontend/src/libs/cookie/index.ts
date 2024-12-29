export const readCookie = (name: string) => {
    if (typeof document === 'undefined') return null;

    const cookie = document.cookie;
    const setPos = cookie.search(new RegExp('\\b' + name + '='));
    const stopPos = cookie.indexOf(';', setPos);

    if (!~setPos) return null;

    const res = decodeURIComponent(cookie.substring(setPos, ~stopPos ? stopPos : undefined).split('=')[1] || '');

    return res.charAt(0) === '{' ? JSON.parse(res) : res;
};

export const setCookie = (name: string, value: string, expires: Date | string): void => {
    if (typeof expires === 'string') return setCookie(name, value, new Date(expires));

    const result = `${name}=${value};path=/;expires=${expires.toUTCString()}`;
    document.cookie = result;
};

export const deleteCookie = (name: string) => setCookie(name, '', new Date('Thu, 01 Jan 1970 00:00:01 GMT'));
