import { suite, test, setup } from "mocha";
import { dataBase } from "../../src/model/db.js";
// @ts-ignore
import { newTestUsers } from "../fixture.js";

suite("user model tests", () => {
  setup(async () => {
    dataBase.init("json");
    await dataBase.userStore!.deleteAll();
  });

  test("create a user", async () => {
    const newUser = await dataBase.userStore!.create(newTestUsers[0]!);
    console.log(newUser);
  });
});
