import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { database } from "../../src/model/database.js";
// @ts-ignore
import { newTestUsers } from "../fixture.js";

suite("user model tests", () => {
  setup(async () => {
    database.init("json");
    await database.userStore!.deleteAll();
  });

  test("create - success", async () => {
    const createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    assert.equal(newTestUsers[0].email, createdUser.email);
  });

  test("get by id  - success", async () => {
    const createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    const foundUser = await database.userStore!.getById(createdUser._id);
    assert.isNotNull(foundUser);
    assert.deepEqual(createdUser, foundUser);
  });

  test("get by id  - fail", async () => {
    const foundUser = await database.userStore!.getById("bad id");
    assert.isNull(foundUser);
  });

  test("get by email  - success", async () => {
    const createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    const foundUser = await database.userStore!.getByEmail(createdUser.email);
    assert.isNotNull(foundUser);
    assert.deepEqual(createdUser, foundUser);
  });

  test("get by email  - fail", async () => {
    const foundUser = await database.userStore!.getByEmail("bad email");
    assert.isNull(foundUser);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await database.userStore!.create(newTestUsers[i]);
      assert.isNotNull(createdUser);
    }
    const foundUsers = await database.userStore!.getAll();
    assert.equal(newTestUsers.length, foundUsers.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await database.userStore!.create(newTestUsers[0]);
      assert.isNotNull(createdUser);
    }
    let foundUsers = await database.userStore!.getAll();
    assert.equal(newTestUsers.length, foundUsers.length);

    await database.userStore!.deleteAll();
    foundUsers = await database.userStore!.getAll();
    assert.equal(foundUsers.length, 0);
  });

  test("delete by id - success", async () => {
    const createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    let foundUser = await database.userStore!.getById(createdUser._id);
    assert.isNotNull(foundUser);

    const deletedUser = await database.userStore!.deleteById(createdUser._id);
    assert.isNotNull(deletedUser);

    foundUser = await database.userStore!.getById(createdUser._id);
    assert.isNull(foundUser);
  });

  test("delete by id - fail", async () => {
    const deletedUser = await database.userStore!.deleteById("bad id");
    assert.isNull(deletedUser);
  });

  test("update - success", async () => {
    const createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    createdUser.firstName = "new name";

    const updatedUser = await database.userStore!.update(createdUser);
    assert.isNotNull(updatedUser);

    const foundUser = await database.userStore!.getById(createdUser._id);
    assert.isNotNull(foundUser);

    assert.equal(foundUser.firstName, "new name");
  });

  test("update - fail", async () => {
    const createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    createdUser._id = "bad id";

    const updatedUser = await database.userStore!.update(createdUser);
    assert.isNull(updatedUser);
  });
});
