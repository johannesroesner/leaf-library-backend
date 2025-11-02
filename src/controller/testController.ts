import type { Request, ResponseToolkit } from "@hapi/hapi";

export const testController = {
  index: (request: Request, responseToolkit: ResponseToolkit) =>
    responseToolkit.view("index-view", {
      title: "Leaf Library",
    }),
};
