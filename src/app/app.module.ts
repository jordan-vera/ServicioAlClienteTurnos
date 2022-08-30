import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { OdontologiaComponent } from './pages/odontologia/odontologia.component';
import { PeluqueriaComponent } from './pages/peluqueria/peluqueria.component';
import { HorariosService } from './servicios/horarios.service';
import { ServicioTurnosService } from './servicios/servicioturnos.service';
import { SolicitudService } from './servicios/solicitud.service';
import { SucursalesService } from './servicios/sucursales.service';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CalificacionComponent } from './pages/calificacion/calificacion.component';
import { ConsultaMedicaComponent } from './pages/consulta-medica/consulta-medica.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    OdontologiaComponent,
    PeluqueriaComponent,
    CalificacionComponent,
    ConsultaMedicaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [
    HorariosService,
    ServicioTurnosService,
    SolicitudService,
    SucursalesService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
