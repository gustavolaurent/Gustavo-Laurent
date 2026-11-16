import type { Store, Worker, Mark, Session } from '../domain/types';

/** Contrato de integración pendiente de verificar con el ERP TREINTA.
 * No agregar rutas supuestas ni secretos al cliente móvil.
 * En producción estas llamadas deben pasar por un backend/proxy autenticado.
 */
export interface ErpApi {
  getStores(session:Session):Promise<Store[]>;
  getCoverage(session:Session, storeId?:string):Promise<Worker[]>;
  getAttendance(session:Session):Promise<Mark[]>;
  submitMark(session:Session, type:'Ingreso'|'Salida', photoUploadId:string, locationProof?:string):Promise<void>;
}

export const erpApi: ErpApi = {
  async getStores(){ throw new Error('ERP no conectado: falta contrato API autenticado.'); },
  async getCoverage(){ throw new Error('ERP no conectado: falta endpoint de cobertura verificado.'); },
  async getAttendance(){ throw new Error('ERP no conectado: falta endpoint de historial verificado.'); },
  async submitMark(){ throw new Error('ERP no conectado: no se aceptan marcaciones reales en esta versión.'); }
};
