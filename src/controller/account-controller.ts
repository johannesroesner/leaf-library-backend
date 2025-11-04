import type { ResponseToolkit } from "@hapi/hapi";

export const accountController = {
  index: (responseToolkit: ResponseToolkit) => responseToolkit.view("index-view", { title: "Leaf Library" }),
  signupGet: (responseToolkit: ResponseToolkit) => responseToolkit.view("signup-view", { title: "Leaf Library - Sign up" }),
  signupPost: (responseToolkit: ResponseToolkit) => {
    responseToolkit.view("signup-view", { title: "Leaf Library - Sign up" });
  },
  validate: (responseToolkit: ResponseToolkit) => responseToolkit.view("index-view", { title: "Leaf Library" }),
};
