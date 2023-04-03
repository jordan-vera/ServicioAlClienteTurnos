import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SolicitudEspecialidadMedica } from '../modelos/SolicitudEspecialidadMedica';
const base_url = environment.base_url_api_go_turnos;

@Injectable({
  providedIn: 'root'
})
export class SolicitudEspecialidadesMedicasService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = base_url;
  }

  getSolicitudespecialidadesMedicas(idsolicitud: number): Observable<any> {
    return this._http.get(this.url + 'solicitud-especialidad-medica/' + idsolicitud);
  }

  createSolicitudespecialidadesMedicas(data: SolicitudEspecialidadMedica): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'agregar-solicitud-especialidad-medica', params, { headers: headers });
  }

}
