import { assert } from "chai";
import { suite, test, setup } from "mocha";
// @ts-ignore
import { httpService } from "./http-service.js";
import { newTestUsers } from "../fixture.js";

suite("user api test", () => {
  const badPayload = Object();

  setup(async () => {
    await httpService.deleteAllUsers();
  });

  test("create - success", async () => {
    const newUser = await httpService.createUser(newTestUsers[0]);
    assert.isNotNull(newUser);
    assert.equal(newUser.email, newTestUsers[0].email);
  });

  test("create - fail, bad payload", async () => {
    try {
      await httpService.createUser(badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const newUser = await httpService.createUser(newTestUsers[i]);
      assert.isNotNull(newUser);
    }
    const foundUsers = await httpService.getAllUsers();
    assert.equal(foundUsers.length, newTestUsers.length);
  });

  test("get by id - success", async () => {
    const newUser = await httpService.createUser(newTestUsers[0]);
    assert.isNotNull(newUser);

    const foundUsers = await httpService.getUserById(newUser._id);
    assert.equal(foundUsers.email, newTestUsers[0].email);
  });

  test("get by id - fail, bad id", async () => {
    try {
      await httpService.getUserById("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("get by email - success", async () => {
    const newUser = await httpService.createUser(newTestUsers[0]);
    assert.isNotNull(newUser);

    const foundUsers = await httpService.getUserByEmail(newUser.email);
    assert.equal(foundUsers.firstName, newTestUsers[0].firstName);
  });

  test("get by email - fail, bad id", async () => {
    try {
      await httpService.getUserByEmail("bad email");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("update - success", async () => {
    const newUser = await httpService.createUser(newTestUsers[0]);
    assert.isNotNull(newUser);
    newUser.email = "new@email.com";

    const updatedUser = await httpService.updateUser(newUser);
    assert.equal(updatedUser.email, "new@email.com");
  });

  test("update - fail, bad payload", async () => {
    try {
      await httpService.updateUser(badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("delete by id - success", async () => {
    const newUser = await httpService.createUser(newTestUsers[0]);
    assert.isNotNull(newUser);
    const foundUser = await httpService.getUserById(newUser._id);
    assert.isNotNull(foundUser);
    await httpService.deleteUser(newUser._id);
    try {
      await httpService.getUserById(newUser);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete by id - fail, bad id", async () => {
    try {
      await httpService.deleteUser("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const newUser = await httpService.createUser(newTestUsers[i]);
      assert.isNotNull(newUser);
    }
    let foundUsers = await httpService.getAllUsers();
    assert.equal(foundUsers.length, newTestUsers.length);

    await httpService.deleteAllUsers();

    foundUsers = await httpService.getAllUsers();
    assert.equal(foundUsers.length, 0);
  });
});
