import apiCall from "./api";

export const uploadRegisterToken = async function ({ id, hashToken }) {
    const res = await apiCall({
        url: `/api/auth/register/${id}`,
        method: "POST",
        data: { hashToken },
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
