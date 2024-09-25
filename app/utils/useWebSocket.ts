// useWebSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useWebSocket = (url: string) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        console.log('Connecting to WebSocket server...');
        socketRef.current = io(url);

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket server:', socketRef.current?.id);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        socketRef.current.on('onMessage', (data) => {
            console.log('Received message from server:', data);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [url]);

    return socketRef.current;
};

export default useWebSocket;
