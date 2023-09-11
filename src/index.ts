import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../config.env` });

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception, shudding down...");
    console.error(err);
    process.exit(1);
});

import mongoose from 'mongoose';
import app from './app';

const port = process.env.SERVER_PORT || 4000;

let database = process.env.DATABASE!!.replace(
    "<password>",
    process.env.DB_PASSWORD!!
);

database = database.replace(
    "<username>",
    process.env.DB_USERNAME!!
);

mongoose.connect(database)
    .then(() => {
        console.log("Db connected successfully");
    })
    .catch(err => console.error("DB connection failed ", err));

const server = app.listen(port, () => {
    console.log("Server listening on port", port);
});


process.on('unhandledRejection', error => {
    console.log("Unhandled rejection, shudding down... ");
    console.log(error);
    server.close(() => {
        process.exit(1);
    });
})


export default server;