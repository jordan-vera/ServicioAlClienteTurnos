import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { BienvenidaComponent } from '../bienvenida/bienvenida.component';
import { OdontologiaComponent } from '../odontologia/odontologia.component';
import { PeluqueriaComponent } from '../peluqueria/peluqueria.component';
import { ConsultaMedicaComponent } from '../consulta-medica/consulta-medica.component';
import { CalificacionComponent } from '../calificacion/calificacion.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
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
        path: "consulta-medica",
        component: ConsultaMedicaComponent
      },
      {
        path: "calificacion/:idsolicitud/:calificacion",
        component: CalificacionComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
