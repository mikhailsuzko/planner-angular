
export class CookieUtils {

    public setCookie(name: string, val: string): void {
        const date = new Date();
        const value = val;
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/; SameSite=Strict; Secure;';
    }

    public getCookie(name: string): string | null {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) {
            return parts.pop()!.split(';').shift()!;
        }
        return null
    }

    public deleteCookie(name: string): void {
        const date = new Date();
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
        document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/';
    }
}




