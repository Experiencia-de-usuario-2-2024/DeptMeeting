import { Socket } from 'socket.io-client';

export const notifyParticipants = (socket: Socket, meetingId: string, user: string, tema?: number) => {
  const payload = {
    room: meetingId,
    user,
    ...(tema && { tema }),
  };
  socket.emit('event_notificar_participante_editando', payload);
};

export const validateFields = (values: Record<string, any>) => {
  return !Object.values(values).some(value => 
    value === undefined || value === '' || value === ' '
  );
};

export const getLocalStorageValue = (key: string) => {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};
