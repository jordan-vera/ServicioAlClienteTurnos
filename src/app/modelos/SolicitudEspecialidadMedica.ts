export class SolicitudEspecialidadMedica {

  public idsolicitudespecialidad: number;
  public idsolicitud: number;
  public idespecialidad: number;

  constructor(
    idsolicitudespecialidad: number,
    idsolicitud: number,
    idespecialidad: number
  ) {
    this.idsolicitudespecialidad = idsolicitudespecialidad;
    this.idsolicitud = idsolicitud;
    this.idespecialidad = idespecialidad;
  }
}


export class SolicitudEspecialidadRelacion {

  public IDSOLICITUD: number;
  public IDPROFESIONAL: number;
  public IDSUCURSAL: number;
  public IDCLIENTE: number;
  public IDSERVICIO: number;
  public FECHA: any;
  public ESTADO: string;
  public FECHATURNO: any;
  public IDHORARIO: number;
  public HORARIO: any;
  public SUCURSAL: any;
  public idespecialidad: number;

  constructor(
    IDSOLICITUD: number,
    IDPROFESIONAL: number,
    IDSUCURSAL: number,
    IDCLIENTE: number,
    IDSERVICIO: number,
    FECHA: any,
    ESTADO: string,
    FECHATURNO: any,
    IDHORARIO: number,
    HORARIO?: any,
    SUCURSAL?: any,
    idespecialidad?: number
  ) {
    this.IDSOLICITUD = IDSOLICITUD;
    this.IDPROFESIONAL = IDPROFESIONAL;
    this.IDSUCURSAL = IDSUCURSAL;
    this.IDCLIENTE = IDCLIENTE;
    this.IDSERVICIO = IDSERVICIO;
    this.FECHA = FECHA;
    this.ESTADO = ESTADO;
    this.FECHATURNO = FECHATURNO;
    this.IDHORARIO = IDHORARIO;
    this.HORARIO = HORARIO;
    this.SUCURSAL = SUCURSAL;
    this.idespecialidad = idespecialidad;
  }
}

export class EspecialidadClinica {

  public idsolicitudespecialidad: number;
  public especialidad: string;
  public nombre: string;
  public direccion: string;

  constructor(
    idsolicitudespecialidad: number,
    especialidad: string,
    nombre: string,
    direccion: string
  ) {
    this.idsolicitudespecialidad = idsolicitudespecialidad;
    this.especialidad = especialidad;
    this.nombre = nombre;
    this.direccion = direccion;
  }
}
