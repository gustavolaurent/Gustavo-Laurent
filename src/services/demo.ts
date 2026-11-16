import type { Store, Worker, Mark, Session } from '../domain/types';
export const stores:Store[]=[
 {id:'ancon',name:'Ancón',district:'Ancón'}, {id:'brena',name:'Breña',district:'Breña'},
 {id:'smp',name:'SMP',district:'San Martín de Porres'}, {id:'piramides',name:'Pirámides',district:'San Juan de Lurigancho'}
];
export const workers:Worker[]=[
 {id:'D-001',name:'Asesor Demo 01',storeId:'ancon',shift:'09:00–18:00',checkIn:'08:56',status:'Presente'},
 {id:'D-002',name:'Asesor Demo 02',storeId:'ancon',shift:'09:00–18:00',checkIn:'09:14',status:'Tardanza'},
 {id:'D-003',name:'Asesor Demo 03',storeId:'brena',shift:'10:00–19:00',status:'Ausente'},
 {id:'D-004',name:'Asesor Demo 04',storeId:'smp',shift:'09:00–18:00',checkIn:'08:52',status:'Presente'},
 {id:'D-005',name:'Asesor Demo 05',storeId:'piramides',shift:'—',status:'Descanso'}
];
export const demoSession=(role:Session['role']):Session=>({role,name:role==='Supervisor'?'Supervisor Demo':'Usuario Demo',storeIds:role==='Supervisor'?['ancon','brena']:stores.map(s=>s.id),permissions:role==='Supervisor'?['coverage.view','attendance.history']:[]});
export const demoMarks:Mark[]=[{id:'M-001',worker:'Asesor Demo 01',store:'Ancón',type:'Ingreso',time:'08:56',demo:true},{id:'M-002',worker:'Asesor Demo 02',store:'Ancón',type:'Ingreso',time:'09:14',demo:true}];
