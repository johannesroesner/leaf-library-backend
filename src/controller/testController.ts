import type { Request, ResponseToolkit } from "@hapi/hapi";

export const testController = {
  index: (request: Request, h: ResponseToolkit) => {
    return h.view("index-view", {
      title: "Leaf Library",
    });
  },
};
