import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url_api_go_turnos;

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = base_url;
  }

  getAllPeluqueria(): Observable<any> {
    return this._http.get(this.url + 'sucursales-peluqueria');
  }

  getAllOdontologia(): Observable<any> {
    return this._http.get(this.url + 'sucursales-odontologia');
  }

}
