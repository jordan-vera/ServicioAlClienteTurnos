import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cliente } from '../modelos/Cliente';
import { Persona } from '../modelos/Persona';
import { Solicitud } from '../modelos/Solicitud';
const base_url = environment.base_url_api_go_turnos;

@Injectable({
  providedIn: 'root',
})
export class ServicioTurnosService {

  constructor(private http: HttpClient) { }

  getPersonaIdentificacion(identificacion: string): Observable<any> {
    return this.http.get(base_url + 'persona-identificacion/' + identificacion);
  }

  createCliente(data: Cliente): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(base_url + 'cliente', params, { headers: headers });
  }

  createPersona(data: Persona): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(base_url + 'persona', params, { headers: headers });
  }

  createSolicitud(data: Solicitud): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(base_url + 'solicitud', params, { headers: headers });
  }

  getSucursales(): Observable<any> {
    return this.http.get(base_url + 'sucursales');
  }

  getHorarios(idservicio: number): Observable<any> {
    return this.http.get(base_url + 'horarios/' + idservicio);
  }

  getHorariosContador(idservicio: number): Observable<any> {
    return this.http.get(base_url + 'horarios-count/' + idservicio);
  }

}
