export class UsuarioProfesion {

  public IDUSUARIO_PROF: number;
  public IDPROFESIONAL: number;
  public USERNICK: string;
  public CLAVE: string;

  constructor(
    IDUSUARIO_PROF: number,
    IDPROFESIONAL: number,
    USERNICK: string,
    CLAVE: string
  ) {
    this.IDUSUARIO_PROF = IDUSUARIO_PROF;
    this.IDPROFESIONAL = IDPROFESIONAL;
    this.USERNICK = USERNICK;
    this.CLAVE = CLAVE;
  }
}
