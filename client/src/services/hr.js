import apiCall from "./api";

export const uploadRegisterToken = async function ({ id, hashToken, email }) {
    const res = await apiCall({
        url: `/api/auth/register/${id}`,
        method: "POST",
        data: { hashToken, email },
    });
    return res;
};

export const fetchAllApplications = async function ({ id }) {
    const res = await apiCall({
        url: `/api/hr/${id}/profiles`,
        method: "GET",
    });
    return res;
};

export const fetchAllVisas = async function ({ id }) {
    const res = await apiCall({
        url: `/api/hr/${id}/visa`,
        method: "GET",
    });
    return res;
};

export const fetchEmailHistory = async function ({ id }) {
    const res = await apiCall({
        url: `/api/hr/${id}/emailHistory`,
        method: "GET",
    });
    return res;
};

export const fetchAllOBApplication = async function ({ id }) {
    const res = await apiCall({
        url: `/api/hr/${id}/applications`,
        method: "GET",
    });
    return res;
};
