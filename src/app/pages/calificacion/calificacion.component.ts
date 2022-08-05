import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Calificacion } from 'src/app/modelos/Calificacion';
import { SolicitudService } from 'src/app/servicios/solicitud.service';
import { Fechac } from 'src/app/servicios/FechaHora';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit {

  public idsolicitud: number = 0;
  public calificacion: number = 0;
  public calificacionCreate: Calificacion = new Calificacion(0,0,0,'');

  constructor(
    private _route: ActivatedRoute,
    private _apiService: SolicitudService
  ) {
    this._route.params.subscribe((params: Params) => {
      this.idsolicitud = params.idsolicitud;
      this.calificacion = params.calificacion;

      this.calificacionCreate.IDSOLICITUD = +this.idsolicitud;
      this.calificacionCreate.CALIFICACION = +this.calificacion;
      this.calificacionCreate.FECHAHORA = Fechac.fechaActual();

      this._apiService.createCalificacion(this.calificacionCreate).subscribe(
        response => {

          window.close()
          window.top.close();
          window.self.close();
        }, error => {
          console.log(error);
        }
      )
    });
  }

  ngOnInit(): void {
  }



}
