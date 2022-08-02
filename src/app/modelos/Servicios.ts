export class Servicios {

  public IDSERVICIO: number;
  public SERVICIO: string;
  public TIPOSERVICIO: string;

  constructor(
    IDSERVICIO: number,
    SERVICIO: string,
    TIPOSERVICIO: string
  ){
    this.IDSERVICIO = IDSERVICIO;
    this.SERVICIO = SERVICIO;
    this.TIPOSERVICIO = TIPOSERVICIO;
  }
}
