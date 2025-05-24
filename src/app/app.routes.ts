import { Routes } from '@angular/router';
import { ConsultardisponibilidadComponent } from './consultardisponibilidad/consultardisponibilidad.component';
import { ActualizarpublicidadComponent } from './actualizarpublicidad/actualizarpublicidad.component';
import { AdministrarhabitacionesComponent } from './administrarhabitaciones/administrarhabitaciones.component';
import { ListadoreservasComponent } from './listadoreservas/listadoreservas.component';
import { ModificarpaginasComponent } from './modificarpaginas/modificarpaginas.component';
import { VerhotelhoyComponent } from './verhotelhoy/verhotelhoy.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { IniciosesionempleadoComponent } from './iniciosesionempleado/iniciosesionempleado.component';
import { AdministrartemporadasComponent } from './administrartemporadas/administrartemporadas.component';
import { AdministrarofertasComponent } from './administrarofertas/administrarofertas.component';
import { authGuard } from './guards/auth.guards';

export const routes: Routes = [
    { path: '', component: IniciosesionempleadoComponent},
    { path: 'iniciosesion', component: IniciosesionempleadoComponent }, 
    { path: 'homeadmin', component: HomeadminComponent , canActivate: [authGuard] },
    { path: 'consultardisponibilidad', component: ConsultardisponibilidadComponent , canActivate: [authGuard] },
    { path: 'actualizarpublicidad', component: ActualizarpublicidadComponent , canActivate: [authGuard] },
    { path: 'administrarhabitaciones', component: AdministrarhabitacionesComponent , canActivate: [authGuard] },
    { path: 'listadoreservas', component: ListadoreservasComponent , canActivate: [authGuard] },
    { path: 'modificarpaginas', component: ModificarpaginasComponent , canActivate: [authGuard] },
    { path: 'verhotelhoy', component: VerhotelhoyComponent , canActivate: [authGuard] },
    { path: 'iniciosesionempleado', component: IniciosesionempleadoComponent, canActivate: [authGuard] },
    { path: 'administrartemporadas', component: AdministrartemporadasComponent, canActivate: [authGuard]},
    { path: 'administrarofertas', component: AdministrarofertasComponent, canActivate: [authGuard]}
];
