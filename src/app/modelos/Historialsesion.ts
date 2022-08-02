export class HistorialSesion {

  public IDHISTORIAL: number;
  public IDUSUARIO_PROF: number;
  public FECHAHORA: string;

  constructor(
    IDHISTORIAL: number,
    IDUSUARIO_PROF: number,
    FECHAHORA: string
  ){
    this.IDHISTORIAL = IDHISTORIAL;
    this.IDUSUARIO_PROF = IDUSUARIO_PROF;
    this.FECHAHORA = FECHAHORA;
  }
}
