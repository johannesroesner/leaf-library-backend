import { assert } from "chai";
import { suite, test, setup } from "mocha";
// @ts-ignore
import { httpService } from "./http-service.js";
import { newAuthenticatedUser } from "../fixture.js";
import { decodeToken } from "../../src/api/jwt-utils.js";

suite("Authentication API tests", async () => {
  const badPayload = Object();

  setup(async () => {
    await httpService.clearAuth();
    const createdUser = await httpService.createUser(newAuthenticatedUser);
    assert.isNotNull(createdUser);
    await httpService.authenticate(createdUser);
    await httpService.deleteAllUsers();
  });

  test("authenticate - success", async () => {
    const createdUser = await httpService.createUser(newAuthenticatedUser);
    assert.isNotNull(createdUser);
    const response = await httpService.authenticate(createdUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("authenticate - fail, bad payload", async () => {
    try {
      const response = await httpService.authenticate(badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("verify Token - success", async () => {
    const createdUser = await httpService.createUser(newAuthenticatedUser);
    assert.isNotNull(createdUser);
    const response = await httpService.authenticate(createdUser);
    assert(response.success);

    const tokenInfos = decodeToken(response.token);
    assert.equal(tokenInfos.id, createdUser._id);
    assert.equal(tokenInfos.email, createdUser.email);
  });

  test("check unauthorized - success", async () => {
    await httpService.clearAuth();
    try {
      await httpService.deleteAllUsers();
      assert.fail("route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
