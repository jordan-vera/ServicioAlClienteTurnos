import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/servicios/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: string = '';
  public clave: string = '';

  constructor(
    private _loginService: LoginService,
    private spinner: NgxSpinnerService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.spinner.show();
    this._loginService.login(this.usuario, this.clave).subscribe(
      response => {
        this.spinner.hide();
        if (response.error) {
          Swal.fire('Credenciales incorrectas!!', '', 'error');
        } else if (response.nombres) {
          Swal.fire(response.nombres + ' NO TIENES AUTORIZACIÓN!!', '', 'warning');
        } else if (response.empleado) {
          this._router.navigate(['/panel']);
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

}
