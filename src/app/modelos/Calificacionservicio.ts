export class Calificacionservicio {

  public IDCALIFICACION: number;
  public IDSOLICITUD: number;
  public CALIFICACION: number;
  public FECHAHORA: string;
  public COMENTARIO: string;

  constructor(
    IDCALIFICACION: number,
    IDSOLICITUD: number,
    CALIFICACION: number,
    FECHAHORA: string,
    COMENTARIO: string
  ){
    this.IDCALIFICACION = IDCALIFICACION;
    this.IDSOLICITUD = IDSOLICITUD;
    this.CALIFICACION = CALIFICACION;
    this.FECHAHORA = FECHAHORA;
    this.COMENTARIO = COMENTARIO;
  }
}
