import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import { webRoutes } from "./web-routes.js";

const result: any = dotenv.config();
if (result.eror) {
  console.log(result.error);
}
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  server.route(webRoutes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init().catch((error: Error) => {
  console.error(error.message);
});
