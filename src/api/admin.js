import { instance } from '.';

export const createUser = async (username, password, first_name, last_name, role, email) => {
    try {
        const res = (
            await instance.post("/users", {username, password, first_name, last_name, role, email})
        ).data;
        return res;
    } catch (e) {
        throw e
    }
}