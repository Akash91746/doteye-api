import express from 'express';
import passport from 'passport';
import expressWs from 'express-ws';
import cors from 'cors';
import session from 'express-session';

import "./authentication/passport-setup";

const expressApp = express();
var { app } = expressWs(expressApp);

import globalErrorHander from './utils/errorController';
import AppError from './utils/AppError';
import authRouter from './authentication/routes/authRoutes';
import quotesRouter from './routes/quotesRoutes';
import morgan from 'morgan';

app.use(express.json());

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL!! }));
app.options(process.env.CLIENT_URL!!, cors());

app.use(session({
    secret: "some-secret",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 100 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.status(200).send("Server is up and running...");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", quotesRouter);

app.all("*", (req, res, next) => {
    const error = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    next(error);
});

app.use(globalErrorHander);

export default app;