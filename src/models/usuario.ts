export interface Usuario {
  id: number
  usuario: string
  nombre: string
  apellido: string
  correo: string
  clave: string
  activo: boolean
  rolId: number;
  sucursalId: number;
}