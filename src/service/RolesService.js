import http from '@/plugins/axios';

export const RolesService = {
    async getAll() {
        return http.get('/roles');
    },
    async get(id) {
        return http.get(`/roles/${id}`);
    },
    async create(data) {
        return http.post('/roles', data);
    },
    async update(id, data) {
        return http.patch(`/roles/${id}`, data);
    },
    async delete(id) {
        return http.delete(`/roles/${id}`);
    }
};
