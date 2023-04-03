export class Especialidades {

  public idespecialidad: number;
  public especialidad: string;
  public estado: number;

  constructor(
    idespecialidad: number,
    especialidad: string,
    estado: number,
  ) {
    this.idespecialidad = idespecialidad;
    this.especialidad = especialidad;
    this.estado = estado;
  }
}
