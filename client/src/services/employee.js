import apiCall, { apiCallDocument } from "./api";

export const fetchEmployee = async (id) => {
    return await apiCall({
        url: `/api/employees/${id}`,
        method: "GET",
    });
};

export const updateEmployee = async ({ id, employee }) => {
    return await apiCall({
        url: `/api/employees/${id}`,
        method: "PUT",
        data: employee,
    });
};

export const fetchDocuments = async (id) => {
    return await apiCall({
        url: `/api/employees/${id}/documents`,
        method: "GET",
    });
};

export const fetchOneDocument = async ({ id, documentId }) => {
    return await apiCall({
        url: `/api/employees/${id}/documents/${documentId}`,
        method: "GET",
    });
};
export const uploadDocument = async ({ id, document }) => {
    return await apiCall({
        url: `/api/employees/${id}/documents`,
        method: "POST",
        data: document,
    });
};
export const deleteDocument = async ({ id, documentId }) => {
    const res = await apiCall({
        url: `/api/employees/${id}/documents/${documentId}`,
        method: "DELETE",
    });
    return res;
};
