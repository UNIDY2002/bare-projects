import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import session from "express-session";
import admin from "./admin";
import { sessionStore } from "./models";
import { ValidationError } from "express-validation";

const app = express();
const port = 9000;

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
}));

app.use(express.json());

app.use("/admin", admin);

// @ts-ignore
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError && err.details.body !== undefined) {
        return res.status(err.statusCode).json({ msg: err.details.body[0].message });
    }

    return res.status(500).json({ msg: "未知错误" });
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
