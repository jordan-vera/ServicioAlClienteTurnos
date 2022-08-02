export class Profesional {

  public IDPROFESIONAL: number;
  public IDPERSONA: number;
  public PROFESION: string;

  constructor(
    IDPROFESIONAL: number,
    IDPERSONA: number,
    PROFESION: string
  ) {
    this.IDPROFESIONAL = IDPROFESIONAL;
    this.IDPERSONA = IDPERSONA;
    this.PROFESION = PROFESION;
  }
}
