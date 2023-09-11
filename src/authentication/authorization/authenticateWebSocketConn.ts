import { Request } from 'express';
import { WebSocket } from 'ws';

function authenticateWebSocketConnection(
    ws: WebSocket,
    req: Request,
    next: () => void
) {
    if (!req.isAuthenticated()) {
        ws.close(4401, 'Authentication failed');
    } else {
        (ws as any).user = req.user;
        next();
    }
}

export default authenticateWebSocketConnection;