import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cliente } from 'src/app/modelos/Cliente';
import { Especialidades } from 'src/app/modelos/Especialidades';
import { Horario } from 'src/app/modelos/Horario';
import { Persona } from 'src/app/modelos/Persona';
import { Solicitud } from 'src/app/modelos/Solicitud';
import { SolicitudEspecialidadMedica } from 'src/app/modelos/SolicitudEspecialidadMedica';
import { EspecialidadesService } from 'src/app/servicios/especialidades.service';
import { Fechac } from 'src/app/servicios/FechaHora';
import { HorariosService } from 'src/app/servicios/horarios.service';
import { ServicioTurnosService } from 'src/app/servicios/servicioturnos.service';
import { SolicitudService } from 'src/app/servicios/solicitud.service';
import { SolicitudEspecialidadesMedicasService } from 'src/app/servicios/solicitudespecialidadesmedicas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-medica',
  templateUrl: './consulta-medica.component.html',
  styleUrls: ['./consulta-medica.component.css']
})
export class ConsultaMedicaComponent implements OnInit {

  public identificacion: string = '';
  public respuesta: string = '';
  public estadoCuenta: string = '';
  public nombreCliente: string = '';
  public emailRecibido: string = '';
  public persona: Persona = new Persona(0, '', '', '', '');
  public cliente: Cliente = new Cliente(0, 0, null);
  public personaEmail: Persona = new Persona(0, '', '', '', '')
  public solicitudCreate: Solicitud = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0);
  public solicitudesAlmacenadas: Solicitud[] = [];
  public fechaSeleccionada: string = "";
  public turnosShow: boolean = false;
  public turnoSeleccionado: string = '';
  public turnoSeleccionadoShow: boolean = false;
  public horariosAll: Horario[] = [];
  public cantidadTurnosAlDia: number = 0;
  public diasDisponibles: any[] = [];
  public intervalo: any;
  public solicitudesRealizadas: Solicitud[] = [];
  public horariosDeServicio: Horario[] = [];
  public hayHorariosHoy: boolean = false;

  public especialidades: Especialidades[] = [];
  public idespecialidad: number = 0;

  public solicitudEspecialidad: SolicitudEspecialidadMedica = new SolicitudEspecialidadMedica(0, 0, 0);

  constructor(
    private _especialidadesService: EspecialidadesService,
    private _servicioTurnos: ServicioTurnosService,
    private _solicitudService: SolicitudService,
    private spinner: NgxSpinnerService,
    private _horarioService: HorariosService,
    private _solicitudEspecialidadService: SolicitudEspecialidadesMedicasService
  ) { }

  ngOnInit(): void {
    this.getHorariosDiarias();
    this.getCantidadHorarios();
    this.getSeisDias();
    this.getEspecialidades();
  }

  guardarRelacionSolicitudEspecialidad(idsolicitud: number): void {
    this.solicitudEspecialidad.idsolicitud = +idsolicitud;
    this.solicitudEspecialidad.idespecialidad = +this.idespecialidad;
    this._solicitudEspecialidadService.createSolicitudespecialidadesMedicas(this.solicitudEspecialidad).subscribe(
      response => {

      }, error => {
        console.log(error);
      }
    )
  }

  getEspecialidades(): void {
    this._especialidadesService.getAllEspecialidades().subscribe(
      response => {
        this.especialidades = response.response;
      }, error => {
        console.log(error);
      }
    )
  }

  seleccionar(fecha: string, idhorario: number): void {
    clearInterval(this.intervalo)
    this.turnoSeleccionado = fecha;
    this.turnoSeleccionadoShow = true;
    this.turnosShow = false;
    this.solicitudCreate.IDHORARIO = idhorario;
  }


  mostrarTurnos(): void {
    this.turnoSeleccionadoShow = false;
    clearInterval(this.intervalo)
    this.turnosShow = true;
    this.verificarSolicitudesRealizadas()
    this.intervalo = setInterval(() => {
      this.verificarSolicitudesRealizadas()
    }, 3000);
  }

  cancelarSolicitud(idsolicitud: number): void {
    this._solicitudService.deleteSolicitud(idsolicitud).subscribe(
      response => {
        Swal.fire('Solicitud cancelada con exito!!', '', 'success');
        this.getSolicitudesAlmacenadas();
      }, error => {
        console.log(error);
      }
    )
  }

  verificarSolicitudesRealizadas(): void {
    var fecha = this.getFechaTurno();
    this.spinner.show();
    this._solicitudService.getSolicitudPorFechaTurno(fecha, 3).subscribe(
      response => {
        this.horariosDeServicio = [];
        this.spinner.hide();
        this.solicitudesRealizadas = response.response;
        if (response.error) {
          for (let k = 0; k < this.horariosAll.length; k++) {
            if (Fechac.fechaActual() == fecha) {
              var hora = +this.horariosAll[k].HORARIO.split(":")[0];
              var horaSistema = +Fechac.horaActual().split(":")[0]
              if (hora > horaSistema) {
                this.horariosDeServicio.push(this.horariosAll[k]);
              }
            } else {
              this.horariosDeServicio.push(this.horariosAll[k]);
            }
          }
        } else {
          this.horariosDeServicio = [];
          var estado = true;
          for (let k = 0; k < this.horariosAll.length; k++) {
            for (let i = 0; i < this.solicitudesRealizadas.length; i++) {
              if (this.solicitudesRealizadas[i].IDHORARIO == this.horariosAll[k].IDHORARIO) {
                estado = false;
              }
            }
            if (estado == true) {
              if (Fechac.fechaActual() == fecha) {
                var hora = +this.horariosAll[k].HORARIO.split(":")[0];
                var horaSistema = +Fechac.horaActual().split(":")[0]
                if (hora > horaSistema) {
                  this.horariosDeServicio.push(this.horariosAll[k]);
                }
              }

            }
            estado = true;
          }
        }
      }, error => {
        this.spinner.hide();
        console.log(error)
      }
    )
  }

  getSeisDias(): void {
    var diaExport = 0; // 11
    var dias = [];
    var nombreDelDia = Fechac.generarNombreDia(Fechac.numeroDia());
    var contador = 0;
    var mes = "";
    var anio = "";
    for (let i = 0; i < 6; i++) {
      if (nombreDelDia == 'sábado' || nombreDelDia == 'domingo') {
        if (nombreDelDia == 'sábado') {
          contador = contador + 2;
          diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
          nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
          mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
          anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
        } else {
          contador = contador + 1;
          diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
          nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
          mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
          anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
        }
      } else {
        if (dias.length == 0) {
          if (Fechac.verificarHora() == false) {
            contador = contador + 1;
            diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
            nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
            mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
            anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
          } else {
            contador = contador + 0;
            diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
            nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
            mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
            anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
          }
        } else {
          if (dias.length > 0) {
            if (nombreDelDia == 'viernes') {
              contador = contador + 3;
            } else {
              contador = contador + 1;
            }
          }
          diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
          nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
          mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
          anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
          if (dias.length == 0) {
            contador = contador + 1;
          }
        }
      }
      dias.push({
        dia: diaExport,
        nombre: nombreDelDia,
        mes: mes,
        anio: anio
      });
    }
    this.diasDisponibles = dias;
  }



  verificarCliente(): void {
    this._servicioTurnos.verificarSiTieneCuentaActiva(this.identificacion).subscribe(
      response => {
        this.respuesta = response.response;
        if (response.response != "noexiste") {
          this.estadoCuenta = response.estadoCuenta;
          this.solicitudesAlmacenadas = [];
        }
        if (response.response == "ok") {
          this.nombreCliente = response.nombres;
          this.emailRecibido = response.email;
          this.persona.NOMBRES = this.nombreCliente;
          this.persona.EMAIL = this.emailRecibido;
          this.persona.IDENTIFICACION = this.identificacion;
          this.VerificarSiExitePersona();
          this.getSolicitudesAlmacenadas();
        }
      }, error => {
        console.log(error);
      }
    )
  }

  EnviarSolicitud(): void {
    if (this.fechaSeleccionada == "") {
      Swal.fire('Seleccionar día !', '', 'error');
    } else {
      this.solicitudCreate.FECHATURNO = this.getFechaTurno();
      this.solicitudCreate.FECHA = Fechac.fechaActual() + ' ' + Fechac.horaActual();
      this.solicitudCreate.ESTADO = "Pendiente";
      this.solicitudCreate.IDSERVICIO = 3;
      this.solicitudCreate.IDSUCURSAL = 1;
      this.spinner.show();
      this._solicitudService.getIdClientePorIdentificacion(this.identificacion).subscribe(
        response => {
          this.spinner.hide();
          this.solicitudCreate.IDCLIENTE = response.idcliente;
          this.solicitudCreate.IDPROFESIONAL = 3;
          this._solicitudService.createSolicitud(this.solicitudCreate).subscribe(
            response => {
              this.guardarRelacionSolicitudEspecialidad(response.response);
              this.enviarNotificacionSolicitud()
              Swal.fire('Solicitud realizada con exito!!', '', 'success');
              this.limpiarForm();
              this.getSolicitudesAlmacenadas()
            }, error => {
              console.log(error);
            }
          )
        }, error => {
          this.spinner.hide();
          console.log(error);
        }
      )
    }
  }

  enviarNotificacionSolicitud(): void {
    this._solicitudService.actualizarEmailCelular(this.identificacion).subscribe(
      response => {
        this._solicitudService.getpersonaPorCedula(this.identificacion).subscribe(
          response => {
            var email = response.response.EMAIL;
            var nombres = response.response.NOMBRES;

            this._solicitudService.enviarEmailSolicitud(email, Fechac.fechaActual() + Fechac.horaActual(), "Odontología", nombres).subscribe(
              response => {
                console.log(response)
              }, error => {
                console.log(error);
              }
            )
          }, error => {
            console.log(error);
          }
        )
      }, error => {
        console.log(error);
      }
    )
  }

  getCantidadHorarios(): void {
    this.spinner.show();
    this._horarioService.getCount(3).subscribe(
      response => {
        this.spinner.hide();
        this.cantidadTurnosAlDia = response.response.COUNT;
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  getHorariosDiarias(): void {
    this.spinner.show();
    this._horarioService.getall(3).subscribe(
      response => {
        this.spinner.hide();
        this.horariosAll = response.response;
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }


  limpiarForm(): void {
    this.turnosShow = false;
    this.turnoSeleccionadoShow = false;
    this.respuesta = "";
    //this.identificacion = "";
    this.fechaSeleccionada = "";
    this.solicitudCreate = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0);
  }

  getFechaTurno(): string {
    var partes = this.fechaSeleccionada.split("#");
    return partes[3] + '-' + Fechac.transformarDeMesAhNumero(partes[2]) + '-' + partes[0];
  }

  getSolicitudesAlmacenadas(): void {
    this.spinner.show();
    this._solicitudService.getIdClientePorIdentificacion(this.identificacion).subscribe(
      response => {
        this.spinner.hide();
        this.solicitudCreate.IDCLIENTE = response.idcliente;
        if (!response.error) {
          this.spinner.show();
          this._solicitudService.getSolicitudPorCliente(response.idcliente, 3).subscribe(
            response => {
              this.spinner.hide();
              this.solicitudesAlmacenadas = response.response;
            }, error => {
              this.spinner.hide();
              console.log(error);
            }
          )
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  VerificarSiExitePersona(): void {
    this.spinner.show();
    this._solicitudService.getpersonaPorCedula(this.identificacion).subscribe(
      response => {
        this.spinner.hide();
        if (response.error) {
          this.agregarPersonaCliente();
        } else {
          this.actualizarEmail()
          var idpersona = response.response.IDPERSONA;
          this._solicitudService.getClientePorId(idpersona).subscribe(
            response => {
              if (response.error) {
                this.agregarCliente(idpersona);
              }
            }, error => {
              console.log(error);
            }
          )
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  actualizarEmail(): void {
    this.personaEmail.IDENTIFICACION = this.identificacion;
    this.personaEmail.EMAIL = this.emailRecibido;
    this._solicitudService.updateEmailPersona(this.personaEmail).subscribe(
      response => {
      }, error => {
        console.log(error)
      }
    )
  }

  agregarPersonaCliente(): void {
    this.spinner.show();
    this._solicitudService.createPersona(this.persona).subscribe(
      response => {
        this.spinner.hide();
        this.agregarCliente(response.idpersona);
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  agregarCliente(idpersona: number): void {
    this.cliente.IDPERSONA = idpersona;
    this.cliente.ULTIMAFECHASOLICUTDUD = new Date();
    this.spinner.show();
    this._solicitudService.createCliente(this.cliente).subscribe(
      response => {
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

}
