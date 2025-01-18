import http from '@/plugins/axios';

export const ProductosService = {
    async getAll(params) {
        return http.get('/productos', { params });
    },
    async get(id) {
        return http.get(`/productos/${id}`);
    },
    async getByCategoria(id) {
        return http.get(`/productos/categoria/${id}`);
    },
    async getByProveedor(id) {
        return http.get(`/productos/proveedor/${id}`);
    },
    async create(data) {
        return http.post('/productos', data);
    },
    async update(id, data) {
        return http.patch(`/productos/${id}`, data);
    },
    async delete(id) {
        return http.delete(`/productos/${id}`);
    }
};
