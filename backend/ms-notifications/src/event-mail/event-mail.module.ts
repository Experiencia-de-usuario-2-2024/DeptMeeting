import { MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Module({})
export class EventMailModule {
  constructor(private readonly mailService: MailerService) { }

  // Evento de crear un nuevo usuario
  @OnEvent('user.created')
  handleUserCreatedEvent(user: any) {
    this.mailService.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      template: 'welcome',
      subject: 'Bienvenido a la app',
      context: {
        name: user.name,
      },
      attachments: [],
    });
  }

  // Evento de modificar fase de un acta dialógica (pre, in y post reunión)
  @OnEvent('meetingMinute.created')
  handlemeetingMinuteCreatedEvent(
    meetingMinuteDTO: any,
    user: any,
  ) {
    console.log("meetingMinuteDTO ->>> EVENT MAIL", meetingMinuteDTO);
    // En caso de que el acta este en fase de pre-reunión
    console.log("meetingMinuteDTO.fase ->>> ", meetingMinuteDTO.fase);
    console.log("valor de la condicional: ", meetingMinuteDTO.fase === 'pre-reunión');
    if (meetingMinuteDTO.fase === 'pre-reunión') {
      console.log("ENTRE AL IF DE PRE-REUNION")

      let u = 0;
      while (u < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[u],
          from: process.env.EMAIL_USER,
          template: 'actacreada',
          // subject: 'Soporte MemFollow: Has sido invitado a una nueva reunión el día ' + new Date(meetingMinuteDTO.startTime).toLocaleDateString() + ' a las ' + meetingMinuteDTO.startHour.toString().split('-')[0],
          subject: 'DeptMeeting: Ha sido invitado a una nueva reunión del consejo del departamento.',
          context: {
            name: user.email,
            titulo: meetingMinuteDTO.title,
            numeroReunion: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fecha: meetingMinuteDTO.startTime,
            hora: meetingMinuteDTO.startHour,
            eventoCalendario: "xdddd",
            periodo: "2025"
          },
          attachments: [],
        });
        u++;
      }
    // En caso de que el acta este en fase de en-reunión    
    } else if (meetingMinuteDTO.fase === 'en-reunión') {

      let i = 0;

      while (i < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[i],
          from: process.env.EMAIL_USER,
          template: 'inmeeting',
          subject: 'DeptMeeting: Ha comenzado la reunión número ' + meetingMinuteDTO.number.toString() + ' del consejo para el periodo 2024.',
          context: {
            name: user.email,
            titulo: meetingMinuteDTO.title,
            numeroReunion: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fecha: meetingMinuteDTO.startTime,
            hora: meetingMinuteDTO.startHour,
            googleMeet: "xdddd",
            temas: ["No se que hablaremos", "Pero de algo hay que hablar"]
          },
          attachments: [],
        });
        i++;

      }


    // En caso de que el acta este en fase de post-reunión
    } else if (meetingMinuteDTO.fase === 'post-reunión') {

      let i = 0;

      while (i < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[i],
          from: process.env.EMAIL_USER,
          template: 'postmeeting',
          subject: 'DeptMeeting: Ha finalizado la reunión número ' + meetingMinuteDTO.number.toString() + ' del consejo para el periodo 2024.',
          context: {
            titulo: meetingMinuteDTO.title,
            numeroReunion: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fecha: meetingMinuteDTO.startTime,
            hora: meetingMinuteDTO.startHour,
          },
          attachments: [],
        });
        i++;

      }

    // En caso de que el acta este en fase de finish
    } else if (meetingMinuteDTO.fase === 'finalizada') {
      let i = 0;
      while (i < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[i],
          from: process.env.EMAIL_USER,
          template: 'finishmeeting',
          subject: 'DeptMeeting: El acta de la reunión número ' + meetingMinuteDTO.number.toString() + ' del consejo ha sido aprobada',
          context: {
            numeroReunion: meetingMinuteDTO.number,
            periodo: "2024"
          },
          attachments: [],
        });
        i++;
      }
    }
  }


  // Evento de crear recordatorio a una tarea
  @OnEvent('meetingMinute.rembemberTask')
  handleRememberTaskEvent(
    remember: any,
    user: any,
  ) {
    this.mailService.sendMail({
      to: user.email,
      cc: remember.oncharge,
      from: process.env.EMAIL_USER,
      template: 'welcome',
      subject: 'Recordatorio de tarea en Meetflow',
      context: {
        name: user.email,
        type: remember.type,
      },
      attachments: [],
    });

  }

  // Evento de invitar a un usuario externo
  @OnEvent('meetingMinute.inviteExternal')
  handleInviteExternalEvent(
    meetingMinuteDTO: any,
    user: any,
  ) {
    this.mailService.sendMail({
      to: meetingMinuteDTO.emailExternal,
      from: process.env.EMAIL_USER,
      template: 'inviteExternal',
      subject: 'Invitación a reunión en plataforma Meetflow',
      context: {
        name: user.email,
        passTemp: meetingMinuteDTO.passTemp,
        emailExternal: meetingMinuteDTO.emailExternal,
        acta: meetingMinuteDTO.title,
        meet: meetingMinuteDTO.number,
        lugar: meetingMinuteDTO.place,
        fase: meetingMinuteDTO.fase,
        linky: meetingMinuteDTO.linky
      },
      attachments: [],
    });

  }

  // Evento de solicitar restablecer contraseña
  @OnEvent('auth.resetpass')
  handleResetPassEvent(
    user: any,
  ) {
    this.mailService.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      template: 'resetpass',
      subject: 'Soporte MemFollow: Recuperación de cuenta',
      context: {
        name: user.email,
        password: user.password
      },
      attachments: [],
    });
  }

    // Evento de invitar a un usuario para ser parte de un proyecto como miembro
    @OnEvent('project.invitemember')
    handleInviteMemberEvent(
      project: any,
      user: any,
    ) {
      console.log("project ->>> ", project);
      console.log("project.newMember ->>> ", project.newMember);
      let emailDestine:string = project.newMember;

      console.log("emailDestine ->>> ", emailDestine);
      console.log("user:", user);
      this.mailService.sendMail({
        to: project.newMember,
        from: process.env.EMAIL_USER,
        template: 'invitemember',
        subject: 'Invitación a proyecto en plataforma Meetflow',
        context: {
          name: "dmeetflow",
          nameproject: project.name,
          newMember: project.newMember,
          linky: project.linky,
        },
        attachments: [],
      });
  
    }

    @OnEvent('auth.newUser')
    handleInviteNewUserEvent(
      userEmailInvited: string,
      passTemp: string,
    ) {
      this.mailService.sendMail({
        to: userEmailInvited,
        from: process.env.EMAIL_USER,
        template: 'invitenewuser',
        subject: 'Invitación a plataforma Meetflow',
        context: {
          userEmailInvited: userEmailInvited,
          passTemp: passTemp,
        },
        attachments: [],
      });
  
    }
}
