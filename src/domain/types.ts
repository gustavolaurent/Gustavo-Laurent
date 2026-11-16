export type Role = 'Administrador'|'Gerencia'|'Supervisor'|'Tienda'|'Asesor'|'RRHH';
export type Permission = 'coverage.view'|'coverage.refresh'|'attendance.history'|'attendance.photos';
export type MarkType = 'Ingreso'|'Salida';
export interface Store { id:string; name:string; district:string }
export interface Worker { id:string; name:string; storeId:string; shift:string; checkIn?:string; status:'Presente'|'Tardanza'|'Ausente'|'Descanso' }
export interface Mark { id:string; worker:string; store:string; type:MarkType; time:string; demo:boolean }
export interface Session { role:Role; name:string; storeIds:string[]; permissions:Permission[] }
