import { Router } from "express";
import expressWs from "express-ws";
import WebSocket from "ws";

import * as quotesController from '../controller/quotesController';
import authenticateWebSocketConnection from "../authentication/authorization/authenticateWebSocketConn";

const router = Router() as expressWs.Router;

router.ws("/quotes", (ws, req, next) => {

    async function sendMessage() {
        if (ws.readyState === WebSocket.OPEN) {
            const quotes = await quotesController.getCacheQuotes();

            if (quotes === undefined) {
                ws.close(4404, "Data not found");
            } else {
                ws.send(JSON.stringify(quotes));
            }
        }
    }

    authenticateWebSocketConnection(ws, req, () => {
        sendMessage();

        const messageSender = setInterval(sendMessage, 30000);

        ws.on('close', () => {
            clearInterval(messageSender);
        });
    });
});

router.ws("/average", (ws, req) => {

    async function sendMessage() {
        if (ws.readyState === WebSocket.OPEN) {
            const average = await quotesController.getAverageResult();

            if (average === undefined) {
                ws.close(4404, "Data not found");
            } else {
                ws.send(JSON.stringify(average));
            }
        }
    }

    authenticateWebSocketConnection(ws, req, () => {
        sendMessage();

        const messageSender = setInterval(sendMessage, 30000);

        ws.on('close', () => {
            clearInterval(messageSender);
        });
    });
});

// router.get("/quotes", quotesController.getQuotes);

// router.get("/average", quotesController.getAverage);

export default router; 