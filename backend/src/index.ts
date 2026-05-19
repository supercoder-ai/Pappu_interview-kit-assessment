/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = 3001;

/**
 * Optional to add any other middlewares here
 */
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(routes);

const server = app.listen(port, () => {
  console.info(`Server listening on localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        process.exit(0);
    });
});

process.on("SIGTERM", () => {
    server.close(() => {
        process.exit(0);
    });
});