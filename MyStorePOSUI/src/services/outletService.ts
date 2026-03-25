import axiosInstance from '../api/axiosInstance';

export const fetchAllOutlets = async () => {
    const response = await axiosInstance.get('/Outlets');
    return response.data;
};

export const fetchOutletById = async (id: string) => {
    const response = await axiosInstance.get(`/Outlets/${id}`);
    return response.data;
};

export const createOutlet = async (data: any) => {
    return await axiosInstance.post('/Outlets', data);
};

export const updateOutlet = async (id: string, data: any) => {
    return await axiosInstance.put(`/Outlets/${id}`, data);
};

export const deleteOutlet = async (id: string) => {
    return await axiosInstance.delete(`/Outlets/${id}`);
};