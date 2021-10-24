import { instance } from '.';

export const logout = async () => {
    try {
        const response = (
            await instance.post("/auth/logout")
        ).data;

        sessionStorage.clear();
        localStorage.clear();
        return response;
    } catch (e) {
        sessionStorage.clear();
        localStorage.clear();
        throw e;
    }
}