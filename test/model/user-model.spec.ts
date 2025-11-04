import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { dataBase } from "../../src/model/db.js";
// @ts-ignore
import { newTestUsers } from "../fixture.js";

suite("user model tests", () => {
  setup(async () => {
    dataBase.init("json");
    await dataBase.userStore!.deleteAll();
  });

  test("create - success", async () => {
    const createdUser = await dataBase.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    assert.equal(newTestUsers[0].email, createdUser.email);
  });

  test("get by id  - success", async () => {
    const createdUser = await dataBase.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    const foundUser = await dataBase.userStore!.getById(createdUser._id);
    assert.isNotNull(foundUser);
    assert.deepEqual(createdUser, foundUser);
  });

  test("get by id  - fail", async () => {
    const foundUser = await dataBase.userStore!.getById("bad id");
    assert.isNull(foundUser);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await dataBase.userStore!.create(newTestUsers[i]);
      assert.isNotNull(createdUser);
    }
    const foundUsers = await dataBase.userStore!.getAll();
    assert.equal(newTestUsers.length, foundUsers.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await dataBase.userStore!.create(newTestUsers[0]);
      assert.isNotNull(createdUser);
    }
    let foundUsers = await dataBase.userStore!.getAll();
    assert.equal(newTestUsers.length, foundUsers.length);

    await dataBase.userStore!.deleteAll();
    foundUsers = await dataBase.userStore!.getAll();
    assert.equal(foundUsers.length, 0);
  });

  test("delete by id - success", async () => {
    const createdUser = await dataBase.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    let foundUser = await dataBase.userStore!.getById(createdUser._id);
    assert.isNotNull(foundUser);

    const deletedUser = await dataBase.userStore!.deleteById(createdUser._id);
    assert.isNotNull(deletedUser);

    foundUser = await dataBase.userStore!.getById(createdUser._id);
    assert.isNull(foundUser);
  });

  test("delete by id - fail", async () => {
    const deletedUser = await dataBase.userStore!.deleteById("bad id");
    assert.isNull(deletedUser);
  });

  test("update by id - success", async () => {
    const createdUser = await dataBase.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    createdUser.firstName = "new name";

    const updatedUser = await dataBase.userStore!.update(createdUser);
    assert.isNotNull(updatedUser);

    const foundUser = await dataBase.userStore!.getById(createdUser._id);
    assert.isNotNull(foundUser);

    assert.equal(foundUser.firstName, "new name");
  });
});
