export class DeptMEventDto {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: string;
  attendees: any;
  conferenceData: {
    createRequest: {
      requestId: string; // Un ID único para la solicitud
      conferenceSolutionKey: {
        type: string; // Especifica que la conferencia será de Google Meet
      };
      status: {
        statusCode: string; // El estado de la solicitud de conferencia
      };
    };
  };
}
