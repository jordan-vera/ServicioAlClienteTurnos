export class Calificacion {

  public IDCALIFICACION: number;
  public IDSOLICITUD: number;
  public CALIFICACION: number;
  public FECHAHORA: string;

  constructor(
    IDCALIFICACION: number,
    IDSOLICITUD: number,
    CALIFICACION: number,
    FECHAHORA: string
  ){
    this.IDCALIFICACION = IDCALIFICACION;
    this.IDSOLICITUD = IDSOLICITUD;
    this.CALIFICACION = CALIFICACION;
    this.FECHAHORA = FECHAHORA;
  }
}
