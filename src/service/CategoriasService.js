import http from '@/plugins/axios';

export const CategoriasService = {
    async getAll() {
        return http.get('/categorias');
    },
    async get(id) {
        return http.get(`/categorias/${id}`);
    },
    async create(data) {
        return http.post('/categorias', data);
    },
    async update(id, data) {
        return http.patch(`/categorias/${id}`, data);
    },
    async delete(id) {
        return http.delete(`/categorias/${id}`);
    }
};
