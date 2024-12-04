import { MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Module({})
export class EventMailModule {
  constructor(private readonly mailService: MailerService) {}

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
  handlemeetingMinuteCreatedEvent(meetingMinuteDTO: any, user: any) {
    console.log('meetingMinuteDTO ->>> EVENT MAIL', meetingMinuteDTO);
    // En caso de que el acta este en fase de pre-reunión
    if (meetingMinuteDTO.fase === 'pre-reunión') {
      console.log('ENTRE AL IF DE PRE-REUNION');
      let s = 0;
      while (s < 1) {
        console.log('ENTRE AL WHILE DE PRE-REUNION');
        this.mailService.sendMail({
          to: meetingMinuteDTO.secretaries[s],
          from: process.env.EMAIL_USER,
          template: 'actacreada',
          // subject: 'Soporte MemFollow: Has sido invitado a una nueva reunión con el rol de secretario/a el día ' + new Date(meetingMinuteDTO.startTime).toLocaleDateString() + ' a las ' + meetingMinuteDTO.startHour.toString().split('-')[0],
          subject:
            'Soporte MemFollow: Has sido invitado a la reunion número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ' con el rol de secretario/a el día ' +
            new Date(meetingMinuteDTO.startTime).toLocaleDateString() +
            ' a las ' +
            meetingMinuteDTO.startHour.toString().split('-')[0],
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            linky: 'ENLACE',
          },
          attachments: [],
        });
        s++;
      }

      let l = 0;
      while (l < meetingMinuteDTO.leaders.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.leaders[l],
          from: process.env.EMAIL_USER,
          template: 'actacreada',
          // subject: 'Soporte MemFollow: Has sido invitado a una nueva reunión con el rol de anfitrión/a el día ' + new Date(meetingMinuteDTO.startTime).toLocaleDateString() + ' a las ' + meetingMinuteDTO.startHour.toString().split('-')[0],
          subject:
            'Soporte MemFollow: Has sido invitado a la reunion número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ' con el rol de anfitrión/a el día ' +
            new Date(meetingMinuteDTO.startTime).toLocaleDateString() +
            ' a las ' +
            meetingMinuteDTO.startHour.toString().split('-')[0],
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            linky: 'ENLACE',
          },
          attachments: [],
        });
        l++;
      }

      let u = 0;
      while (u < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[u],
          from: process.env.EMAIL_USER,
          template: 'actacreada',
          // subject: 'Soporte MemFollow: Has sido invitado a una nueva reunión el día ' + new Date(meetingMinuteDTO.startTime).toLocaleDateString() + ' a las ' + meetingMinuteDTO.startHour.toString().split('-')[0],
          subject:
            'Soporte MemFollow: Has sido invitado a la reunion número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ' el día ' +
            new Date(meetingMinuteDTO.startTime).toLocaleDateString() +
            ' a las ' +
            meetingMinuteDTO.startHour.toString().split('-')[0],
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            linky: 'ENLACE',
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
          subject:
            'Soporte Meetflow: Ha comenzado la reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto,
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        i++;
      }

      let s = 0;
      while (s < meetingMinuteDTO.secretaries.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.secretaries[s],

          from: process.env.EMAIL_USER,
          template: 'inmeeting',
          // subject: 'Soporte Meetflow: Ha comenzado la reunión , no olvides que eres secretario/a',
          subject:
            'Soporte Meetflow: Ha comenzado la reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ', no olvides que eres secretario/a',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        s++;
      }

      let l = 0;
      while (l < meetingMinuteDTO.leaders.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.leaders[l],
          from: process.env.EMAIL_USER,
          template: 'inmeeting',
          // subject: 'Soporte Meetflow: Ha comenzado la reunión, no olvides que eres anfitrión/a',
          subject:
            'Soporte Meetflow: Ha comenzado la reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ', no olvides que eres anfitrión/a',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        l++;
      }

      // En caso de que el acta este en fase de post-reunión
    } else if (meetingMinuteDTO.fase === 'post-reunión') {
      let i = 0;

      while (i < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[i],
          from: process.env.EMAIL_USER,
          template: 'postmeeting',
          subject:
            'Soporte Meetflow: Ha finalizado la reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto,
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        i++;
      }

      let s = 0;
      while (s < meetingMinuteDTO.secretaries.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.secretaries[s],

          from: process.env.EMAIL_USER,
          template: 'postmeeting',
          // subject: 'Soporte Meetflow: Ha finalizado la reunión, no olvides que eres secretario/a',
          subject:
            'Soporte Meetflow: Ha finalizado la reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ', no olvides que eres secretario/a',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        s++;
      }
      let l = 0;
      while (l < meetingMinuteDTO.leaders.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.leaders[l],

          from: process.env.EMAIL_USER,
          template: 'postmeeting',
          // subject: 'Soporte Meetflow: Ha finalizado la reunión, no olvides que eres anfitrión/a',
          subject:
            'Soporte Meetflow: Ha finalizado la reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ', no olvides que eres anfitrión/a',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        l++;
      }
      // En caso de que el acta este en fase de finish
    } else if (meetingMinuteDTO.fase === 'finalizada') {
      let i = 0;
      while (i < meetingMinuteDTO.participants.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.participants[i],
          from: process.env.EMAIL_USER,
          template: 'finishmeeting',
          subject:
            'Soporte Meetflow: La reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ' ha sido archivada',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        i++;
      }

      let s = 0;
      while (s < meetingMinuteDTO.secretaries.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.secretaries[s],
          from: process.env.EMAIL_USER,
          template: 'finishmeeting',
          // subject: 'Soporte Meetflow: La reunión ha sido archivada, no olvides que eres secretario/a',
          subject:
            'Soporte Meetflow: La reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ' ha sido archivada, no olvides que eres secretario/a',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        s++;
      }

      let l = 0;
      while (l < meetingMinuteDTO.leaders.length) {
        this.mailService.sendMail({
          to: meetingMinuteDTO.leaders[l],
          from: process.env.EMAIL_USER,
          template: 'finishmeeting',
          // subject: 'Soporte Meetflow: La reunión ha sido archivada, no olvides que eres anfitrión/a',
          subject:
            'Soporte Meetflow: La reunión número ' +
            meetingMinuteDTO.number.toString() +
            ' del proyecto ' +
            meetingMinuteDTO.nombreCortoProyecto +
            ' ha sido archivada, no olvides que eres anfitrión/a',
          context: {
            name: user.email,
            acta: meetingMinuteDTO.title,
            meet: meetingMinuteDTO.number,
            lugar: meetingMinuteDTO.place,
            fase: meetingMinuteDTO.fase,
            // linky: meetingMinuteDTO.linky
          },
          attachments: [],
        });
        l++;
      }
    }
  }

  // Evento de crear recordatorio a una tarea
  @OnEvent('meetingMinute.rembemberTask')
  handleRememberTaskEvent(remember: any, user: any) {
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
  handleInviteExternalEvent(meetingMinuteDTO: any, user: any) {
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
        linky: meetingMinuteDTO.linky,
      },
      attachments: [],
    });
  }

  // Evento de solicitar restablecer contraseña
  @OnEvent('auth.resetpass')
  handleResetPassEvent(user: any) {
    this.mailService.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      template: 'resetpass',
      subject: 'Soporte MemFollow: Recuperación de cuenta',
      context: {
        name: user.email,
        password: user.password,
      },
      attachments: [],
    });
  }

  // Evento de invitar a un usuario para ser parte de un proyecto como miembro
  @OnEvent('project.invitemember')
  handleInviteMemberEvent(project: any, user: any) {
    console.log('project ->>> ', project);
    console.log('project.newMember ->>> ', project.newMember);
    const emailDestine: string = project.newMember;

    console.log('emailDestine ->>> ', emailDestine);
    console.log('user:', user);
    this.mailService.sendMail({
      to: project.newMember,
      from: process.env.EMAIL_USER,
      template: 'invitemember',
      subject: 'Invitación a proyecto en plataforma Meetflow',
      context: {
        name: 'dmeetflow',
        nameproject: project.name,
        newMember: project.newMember,
        linky: project.linky,
      },
      attachments: [],
    });
  }

  @OnEvent('auth.newUser')
  handleInviteNewUserEvent(userEmailInvited: string, passTemp: string) {
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
