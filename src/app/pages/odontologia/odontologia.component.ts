import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/modelos/Cliente';
import { Horario } from 'src/app/modelos/Horario';
import { Persona } from 'src/app/modelos/Persona';
import { Solicitud } from 'src/app/modelos/Solicitud';
import { Sucursal } from 'src/app/modelos/Sucursal';
import { Fechac } from 'src/app/servicios/FechaHora';
import { HorariosService } from 'src/app/servicios/horarios.service';
import { SolicitudService } from 'src/app/servicios/solicitud.service';
import { SucursalesService } from 'src/app/servicios/sucursales.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { ServicioTurnosService } from 'src/app/servicios/servicioturnos.service';

@Component({
  selector: 'app-odontologia',
  templateUrl: './odontologia.component.html',
  styleUrls: ['./odontologia.component.css']
})
export class OdontologiaComponent implements OnInit {

  public sucursales: Sucursal[] = [];
  public fechaSeleccionada: string = "";
  public cantidadTurnosAlDia: number = 0;
  public diasDisponibles: any[] = [];
  public solicitudesRealizadas: Solicitud[] = [];
  public solicitudesAlmacenadas: Solicitud[] = [];
  public ultimasolicitudesAlmacenadas: Solicitud = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0, '', '');
  public horariosDeServicio: Horario[] = [];
  public horariosAll: Horario[] = [];
  public horariosFiltrados: Horario[] = [];
  public turnosShow: boolean = false;
  public turnoSeleccionado: string = '';
  public turnoSeleccionadoShow: boolean = false;
  public solicitudCreate: Solicitud = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0);
  public persona: Persona = new Persona(0, '', '', '', '')
  public cliente: Cliente = new Cliente(0, 0, null);
  public cantidadNumeroDiaUltimaSolicitud: number = 15;
  public personaEmail: Persona = new Persona(0, '', '', '', '')

  //datos de persona
  public identificacion: string = '';
  public intervalo: any;
  public siTieneSeguroMortuorio: string = '';
  public nombrePersonaConsultada: string = '';
  public emailPersonaConsultada: string = '';
  public tipoSeguro: string = '';
  public tipo: string = '';
  public fechaSeguro: string = '';

  constructor(
    private _sucursalesService: SucursalesService,
    private _horarioService: HorariosService,
    private _solicitudService: SolicitudService,
    private _servicioTurnoService: ServicioTurnosService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getSucursales();
    this.getSeisDias();
    this.getCantidadHorarios();
    this.getHorariosDiarias();
  }

  eliminarSolicitud(ideliminar): void {
    this.spinner.show();
    this._solicitudService.deleteSolicitud(ideliminar).subscribe(
      response => {
        this.spinner.hide();
        Swal.fire('Solicitud eliminada con exito!!', '', 'success');
        this.getSolicitudesAlmacenadas();
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  verificarSitieneSeguroMortuorio(): void {
    this.spinner.show();
    this._solicitudService.verificarSeguroMortuorio(this.identificacion).subscribe(
      response => {
        this.spinner.hide();
        if (response.response == "SI EXISTE") {
          this.actualizarTipoCuentaTipoSeguro(this.identificacion, response.TIPOCUENTA, response.TIPO);
          this.tipo = response.TIPO;
          if (response.TIPO == "AHORRO JUNIOR") {
            this.tipoSeguro = "AHORRO JUNIOR";
          } else {
            this.tipoSeguro = response.data.concepto;
            this.fechaSeguro = response.data.FECHA;
          }
          this.siTieneSeguroMortuorio = "existe";
          this.nombrePersonaConsultada = response.data.NOMBREUNIDO;
          this.emailPersonaConsultada = response.data.email;
          this.persona.NOMBRES = response.data.NOMBREUNIDO;
          this.persona.EMAIL = response.data.email;
          this.persona.IDENTIFICACION = response.data.identificacion;
          this.VerificarSiExitePersona();
          this.getSolicitudesAlmacenadas();
          this.actualizarEmail();
          //this.actualizarEmail();
        } else {
          this.siTieneSeguroMortuorio = "noexiste"
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  actualizarTipoCuentaTipoSeguro(identificacion: string, tipocuenta: string, tiposeguro: string): void {
    this._servicioTurnoService.actualizarTipocuentaTipoSeguro(identificacion, tipocuenta, tiposeguro).subscribe(
      response => {
      }, error => {
        console.log(error);
      }
    )
  }

  actualizarEmail(): void {
    this.personaEmail.IDENTIFICACION = this.identificacion;
    this.personaEmail.EMAIL = this.emailPersonaConsultada;
    this._solicitudService.updateEmailPersona(this.personaEmail).subscribe(
      response => {

      }, error => {
        console.log(error)
      }
    )
  }

  cancelarSolicitud(idsolicitud: number): void {
    this.spinner.show();
    this._solicitudService.deleteSolicitud(idsolicitud).subscribe(
      response => {
        this.spinner.hide();
        Swal.fire('Solicitud cancelada con exito!!', '', 'success');
        this.getSolicitudesAlmacenadas();
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  getSolicitudesAlmacenadas(): void {
    this.spinner.show();
    this._solicitudService.getIdClientePorIdentificacion(this.identificacion).subscribe(
      response => {
        this.spinner.hide();
        this.solicitudCreate.IDCLIENTE = response.idcliente;
        if (!response.error) {
          this.spinner.show();
          this._solicitudService.getSolicitudPorCliente(response.idcliente, 2).subscribe(
            response => {
              this.spinner.hide();
              this.solicitudesAlmacenadas = response.response;

              if (response.response) {
                this.getUltimaSolicitudEnviada(this.solicitudCreate.IDCLIENTE);
              } else {
                this.cantidadNumeroDiaUltimaSolicitud = 8;
              }
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

  getUltimaSolicitudEnviada(idcliente: number): void {
    this.spinner.show();
    this._solicitudService.getUltimaSolicitudPorCliente(idcliente, 2).subscribe(
      response => {
        this.spinner.hide();
        if (response.response) {
          this.ultimasolicitudesAlmacenadas = response.response;
          var diaDIferencia = Fechac.restarFechas(this.ultimasolicitudesAlmacenadas.FECHATURNO, Fechac.fechaActual())
          this.cantidadNumeroDiaUltimaSolicitud = diaDIferencia;
        } else {
          this.cantidadNumeroDiaUltimaSolicitud = 8;
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }


  EnviarSolicitud(): void {
    if (this.solicitudCreate.IDSUCURSAL == 0 || this.solicitudCreate.IDSUCURSAL == null) {
      Swal.fire('Selecciona la sucursal!', '', 'error');
    } else {
      if (this.fechaSeleccionada == "" || this.fechaSeleccionada == null) {
        Swal.fire('Selecciona la día!', '', 'error');
      } else {
        this.solicitudCreate.FECHATURNO = this.getFechaTurno();
        this.solicitudCreate.FECHA = Fechac.fechaActual() + ' ' + Fechac.horaActual();
        this.solicitudCreate.ESTADO = "Pendiente";
        this.solicitudCreate.IDSERVICIO = 2;
        this.solicitudCreate.IDSUCURSAL = +this.solicitudCreate.IDSUCURSAL;
        this.spinner.show();
        this._solicitudService.getIdClientePorIdentificacion(this.identificacion).subscribe(
          response => {
            this.spinner.hide();
            this.solicitudCreate.IDCLIENTE = response.idcliente;
            this.solicitudCreate.IDPROFESIONAL = 1;
            this._solicitudService.createSolicitud(this.solicitudCreate).subscribe(
              response => {
                this.enviarNotificacion();
                Swal.fire('Solicitud finalizada con exito!!', '', 'success');
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
  }

  enviarNotificacion(): void {
    this.spinner.show();
    this._solicitudService.notificar(this.emailPersonaConsultada, Fechac.fechaActual() + ' ' + Fechac.horaActual(), 'Odontología', this.nombrePersonaConsultada).subscribe(
      response => {
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  limpiarForm(): void {
    this.turnosShow = false;
    this.turnoSeleccionadoShow = false;
    this.solicitudCreate = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0);
  }

  getFechaTurno(): string {
    var partes = this.fechaSeleccionada.split("#");
    var dia = '';
    if (partes[0].length == 1) {
      dia = '0' + partes[0];
    } else {
      dia = partes[0];
    }
    return partes[3] + '-' + Fechac.transformarDeMesAhNumero(partes[2]) + '-' + dia;
  }

  seleccionar(fecha: string, idhorario: number): void {
    clearInterval(this.intervalo)
    this.turnoSeleccionado = fecha;
    this.turnoSeleccionadoShow = true;
    this.turnosShow = false;
    this.solicitudCreate.IDHORARIO = idhorario;
  }

  VerificarSiExitePersona(): void {
    this.spinner.show();
    this._solicitudService.getpersonaPorCedula(this.identificacion).subscribe(
      response => {
        this.spinner.hide();
        if (response.error) {
          this.agregarPersonaCliente();
        } else {
          var idpersona = response.response.IDPERSONA;
          this.spinner.show();
          this._solicitudService.getClientePorId(idpersona).subscribe(
            response => {
              this.spinner.hide();
              this.getSolicitudesAlmacenadas();
              if (response.error) {
                this.spinner.hide();
                this.agregarCliente(idpersona);
              }
            }, error => {
              console.log(error);
            }
          )
        }
        //this.getSolicitudesAlmacenadas();
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  agregarPersonaCliente(): void {
    this.spinner.show();
    this._solicitudService.createPersona(this.persona).subscribe(
      response => {
        this.spinner.hide();
        setTimeout(() => {
          this.agregarCliente(response.idpersona);
        }, 2000);
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  agregarCliente(idpersona: number): void {
    this.cliente.IDPERSONA = +idpersona;
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

  mostrarTurnos(): void {
    this.turnoSeleccionadoShow = false;
    clearInterval(this.intervalo)
    this.turnosShow = true;
    this.verificarSolicitudesRealizadas()
    this.intervalo = setInterval(() => {
      this.verificarSolicitudesRealizadas()
    }, 3000);
  }

  verificarSolicitudesRealizadas(): void {
    var fecha = this.getFechaTurno();
    this._solicitudService.getSolicitudPorFechaTurno(fecha, 2).subscribe(
      response => {
        this.horariosDeServicio = [];
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
                var horaSistema = +Fechac.horaActual().split(":")[0];
                if (hora > horaSistema) {
                  if (this.comparacionHorasDetalladasHorario(this.horariosAll[k].HORARIO.split("-")[0], Fechac.horaActual().split(":")[0] + ':' + Fechac.horaActual().split(":")[1])) {
                    this.horariosDeServicio.push(this.horariosAll[k]);
                  }
                }
              } else {
                this.horariosDeServicio.push(this.horariosAll[k]);
              }
            }
            estado = true;
          }
        }
      }, error => {
        console.log(error)
      }
    )
  }

  comparacionHorasDetalladasHorario(horario: string, horaSistema: string): boolean {
    var respuesta = false;
    if ((+horario.split(':')[0]) == (+horaSistema.split(':')[0])) {
      if ((+horario.split(':')[1]) > (+horaSistema.split(':')[1])) {
        respuesta = true;
      } else {
        respuesta = false;
      }
    } else {
      respuesta = true;
    }
    return respuesta;
  }

  getHorariosDiarias(): void {
    this.spinner.show();
    this._horarioService.getall(2).subscribe(
      response => {
        this.spinner.hide();
        this.horariosAll = response.response;
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

  calcularHorasActuales(): void {
    var horaActual = Fechac.horaActual();
    var turnoHora = +horaActual.split(":")[0];
    if (turnoHora > 7 && turnoHora < 17) {
      for (let i = 0; i < this.horariosAll.length; i++) {
        var horaInicio = +this.horariosAll[i].HORARIO.split(":")[0];
        if (turnoHora > horaInicio) {
        } else {
          this.horariosFiltrados.push(this.horariosAll[i]);
        }
      }
      this.horariosAll = this.horariosFiltrados;
    }
  }

  getCantidadHorarios(): void {
    this.spinner.show();
    this._horarioService.getCount(2).subscribe(
      response => {
        this.spinner.hide();
        this.cantidadTurnosAlDia = response.response.COUNT;
      }, error => {
        this.spinner.hide();
        console.log(error);
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

  getSucursales(): void {
    this.spinner.show();
    this._sucursalesService.getAllOdontologia().subscribe(
      response => {
        this.spinner.hide();
        this.sucursales = response.response;
      }, error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

}
