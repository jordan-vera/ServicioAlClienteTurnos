import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { OdontologiaComponent } from './pages/odontologia/odontologia.component';
import { PeluqueriaComponent } from './pages/peluqueria/peluqueria.component';

const routes: Routes = [
  {
    path: "",
    component: BienvenidaComponent
  },
  {
    path: "odontologia",
    component: OdontologiaComponent
  },
  {
    path: "peluqueria",
    component: PeluqueriaComponent
  },
  {
    path: "calificacion/:idsolicitud/:calificacion",
    component: CalificacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
