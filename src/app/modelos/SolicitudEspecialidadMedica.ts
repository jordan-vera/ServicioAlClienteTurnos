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
