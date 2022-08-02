import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url_api_go_turnos;

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = base_url;
  }

  getCount(idservicio: number): Observable<any> {
    return this._http.get(this.url + 'horarios-count/' + idservicio);
  }

  getall(idservicio: number): Observable<any> {
    return this._http.get(this.url + 'horarios/' + idservicio);
  }

}
