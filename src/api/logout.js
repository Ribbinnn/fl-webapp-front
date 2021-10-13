import { instance } from '.';

export const logout = async () => {
    try {
        const respond = (
            await instance.post("/auth/logout")
        ).data;
        return respond;
    } catch (e) {
        throw e;
    }
}