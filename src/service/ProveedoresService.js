import http from '@/plugins/axios';

export const ProveedoresService = {
    async getAll() {
        return http.get('/proveedores');
    },
    async get(id) {
        return http.get(`/proveedores/${id}`);
    },
    async create(data) {
        return http.post('/proveedores', data);
    },
    async update(id, data) {
        return http.patch(`/proveedores/${id}`, data);
    },
    async delete(id) {
        return http.delete(`/proveedores/${id}`);
    }
};
