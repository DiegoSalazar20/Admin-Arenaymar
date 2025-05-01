import { Routes } from '@angular/router';
import { ConsultardisponibilidadComponent } from './consultardisponibilidad/consultardisponibilidad.component';
import { ActualizarpublicidadComponent } from './actualizarpublicidad/actualizarpublicidad.component';
import { AdministrarhabitacionesComponent } from './administrarhabitaciones/administrarhabitaciones.component';
import { ListadoreservasComponent } from './listadoreservas/listadoreservas.component';
import { ModificarpaginasComponent } from './modificarpaginas/modificarpaginas.component';
import { VerhotelhoyComponent } from './verhotelhoy/verhotelhoy.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { IniciosesionempleadoComponent } from './iniciosesionempleado/iniciosesionempleado.component';

export const routes: Routes = [
    { path: '', component: IniciosesionempleadoComponent}, 
    { path: 'homeadmin', component: HomeadminComponent },
    { path: 'consultardisponibilidad', component: ConsultardisponibilidadComponent },
    { path: 'actualizarpublicidad', component: ActualizarpublicidadComponent },
    { path: 'administrarhabitaciones', component: AdministrarhabitacionesComponent },
    { path: 'listadoreservas', component: ListadoreservasComponent },
    { path: 'modificarpaginas', component: ModificarpaginasComponent },
    { path: 'verhotelhoy', component: VerhotelhoyComponent },
    { path: 'iniciosesionempleado', component: IniciosesionempleadoComponent},
    
];
