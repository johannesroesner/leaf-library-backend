import { assert } from "chai";
import { suite, test, setup } from "mocha";
// @ts-ignore
import { httpService } from "./http-service.js";
import { newAuthenticatedUser, newTestPlants, newTestUsers } from "../fixture.js";
import type { User } from "../../src/model/interface/user.js";

suite("plant api test", () => {
  const badPayload = Object();
  let createdUser: User;

  setup(async () => {
    httpService.clearAuth();
    let authenticatedUser = await httpService.createUser(newAuthenticatedUser);
    assert.isNotNull(authenticatedUser);
    await httpService.authenticate(authenticatedUser);
    await httpService.deleteAllPlants();
    await httpService.deleteAllCollections();
    await httpService.deleteAllUsers();
    authenticatedUser = await httpService.createUser(newAuthenticatedUser);
    await httpService.authenticate(authenticatedUser);
    createdUser = await httpService.createUser(newTestUsers[0]);
    assert.isNotNull(createdUser);
  });

  test("create - success", async () => {
    const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    assert.equal(createdPlant.commonName, newTestPlants[0].commonName);
  });

  test("create - fail, bad payload", async () => {
    try {
      await httpService.createPlantForUser(createdUser._id, badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("create - fail, bad userId", async () => {
    try {
      await httpService.createPlantForUser("bad id", newTestPlants[0]);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("get by id - success", async () => {
    const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);

    const foundPlant = await httpService.getPlantById(createdPlant._id);
    assert.isNotNull(foundPlant);
    assert.equal(foundPlant.commonName, newTestPlants[0].commonName);
  });

  test("get by id - fail, bad id", async () => {
    try {
      await httpService.getPlantById("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }

    const foundPlants = await httpService.getAllPlants();
    assert.equal(foundPlants.length, newTestPlants.length);
  });

  test("get all for user - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }

    const foundPlants = await httpService.getAllPlantsForUser(createdUser._id);
    assert.equal(foundPlants.length, newTestPlants.length);
  });

  test("get all for user - fail, bad userId", async () => {
    try {
      await httpService.getAllPlantsForUser("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("update - success", async () => {
    const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    createdPlant.commonName = "Monstera";

    const updatedPlant = await httpService.updatePlant(createdPlant);
    assert.equal(updatedPlant.commonName, "Monstera");
  });

  test("update - fail, bad payload", async () => {
    try {
      await httpService.updatePlant(badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("delete by id - success", async () => {
    const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    const foundPlant = await httpService.getPlantById(createdPlant._id);
    assert.isNotNull(foundPlant);
    await httpService.deletePlant(createdPlant._id);
    try {
      await httpService.getPlantById(createdPlant._id);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete by id - fail, bad id", async () => {
    try {
      await httpService.deletePlant("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    let foundPlants = await httpService.getAllPlants();
    assert.equal(foundPlants.length, newTestPlants.length);

    await httpService.deleteAllPlants();

    foundPlants = await httpService.getAllPlants();
    assert.equal(foundPlants.length, 0);
  });
});
