import apiCall from "./api";

export const uploadRegisterToken = async function ({ id, hashToken }) {
    const res = await apiCall({
        url: `/api/auth/register/${id}`,
        method: "POST",
        data: { hashToken },
    });
    return res;
};
