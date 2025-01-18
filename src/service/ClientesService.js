import http from '@/plugins/axios';

export const ClientesService = {
    async getAll(params) {
        return http.get('/clientes', { params });
    },
    async get(id) {
        return http.get(`/clientes/${id}`);
    },
    async create(data) {
        return http.post('/clientes', data);
    },
    async update(id, data) {
        return http.patch(`/clientes/${id}`, data);
    },
    async delete(id) {
        return http.delete(`/clientes/${id}`);
    }
};
