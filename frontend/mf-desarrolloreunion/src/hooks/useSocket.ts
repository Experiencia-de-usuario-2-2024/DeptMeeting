import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

export const useSocket = (backendUrl: string) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on('messageVer2', (payload: any) => {
      setMessages(prev => [...prev, `- ${payload.user}: ${payload.message}`]);
    });

    newSocket.on('new_lista_participantes', (payload: any[]) => {
      if (payload.length > 1) {
        setParticipants(payload);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [backendUrl]);

  const sendMessage = (room: string, message: string) => {
    const token = localStorage.getItem('tokenUser');
    const decodedToken: any = token ? jwtDecode(token) : null;
    
    socket?.emit('messageVer2', {
      room,
      user: decodedToken?.email,
      message
    });
  };

  return {
    socket,
    messages,
    participants,
    sendMessage
  };
};
