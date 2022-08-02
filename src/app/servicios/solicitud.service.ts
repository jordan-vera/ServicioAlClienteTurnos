import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Persona } from '../modelos/Persona';
import { Cliente } from '../modelos/Cliente';
import { Solicitud } from '../modelos/Solicitud';
const base_url = environment.base_url_api_go_turnos;

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = base_url;
  }

  verificarSeguroMortuorio(identificacion: string): Observable<any> {
    return this._http.get(this.url + 'verificar-seguro-mortuorio/' + identificacion);
  }

  getAllPorFecha(idservicio: number, fecha: string): Observable<any> {
    return this._http.get(this.url + 'solicitudes-por-fecha/' + fecha + '/' + idservicio);
  }

  getpersonaPorCedula(identificacion: string): Observable<any> {
    return this._http.get(this.url + 'persona-por-cedula/' + identificacion);
  }

  getClientePorId(idpersona: number): Observable<any> {
    return this._http.get(this.url + 'cliente-one/' + idpersona);
  }

  getIdClientePorIdentificacion(identificacion: string): Observable<any> {
    return this._http.get(this.url + 'cliente-id-poridentificacion/' + identificacion);
  }

  getSolicitudPorFechaTurno(fechaturno: string, idservicio: number): Observable<any> {
    return this._http.get(this.url + 'solicitudes-por-fecha/' + fechaturno + '/' + idservicio);
  }

  getSolicitudPorCliente(idcliente: number, idservicio: number): Observable<any> {
    return this._http.get(this.url + 'solicitudes-por-cliente/' + idcliente + '/' + idservicio);
  }

  getUltimaSolicitudPorCliente(idcliente: number, idservicio: number): Observable<any> {
    return this._http.get(this.url + 'ultima-solicitud-cliente/' + idcliente + '/' + idservicio);
  }

  notificar(email: string, fecha: string, servicio: string, nombres: string): Observable<any> {
    return this._http.get(this.url + 'enviar-email/' + email + '/' + fecha + '/' + servicio + '/' + nombres);
  }

  createPersona(data: Persona): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'persona', params, { headers: headers });
  }

  createCliente(data: Cliente): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'cliente', params, { headers: headers });
  }

  createSolicitud(data: Solicitud): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'solicitud', params, { headers: headers });
  }

  deleteSolicitud(idsolicitud: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete(this.url + 'eliminar-solicitud/' + idsolicitud, { headers: headers });
  }

}
