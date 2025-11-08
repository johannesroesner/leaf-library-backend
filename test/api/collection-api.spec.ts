import { assert } from "chai";
import { suite, test, setup } from "mocha";
// @ts-ignore
import { httpService } from "./http-service.js";
import { newAuthenticatedUser, newTestCollections, newTestPlants, newTestUsers } from "../fixture.js";
import type { User } from "../../src/model/interface/user.js";
import { Plant } from "../../src/model/interface/plant";

suite("collection api test", () => {
  const badPayload = Object();
  let createdUser: User;
  let createdPlant: Plant;

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
    createdPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
  });

  test("create - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    assert.equal(createdCollection.name, newTestCollections[0].name);
  });

  test("create - fail, bad payload", async () => {
    try {
      await httpService.createCollectionForUser(createdUser._id, badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("create - fail, bad userId", async () => {
    try {
      await httpService.createCollectionForUser("bad id", newTestCollections[0]);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("get by id - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const foundCollection = await httpService.getCollectionById(createdCollection._id);
    assert.isNotNull(foundCollection);
    assert.equal(foundCollection.name, newTestCollections[0].name);
  });

  test("get by id - fail, bad id", async () => {
    try {
      await httpService.getCollectionById("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }

    const foundCollections = await httpService.getAllCollections();
    assert.equal(foundCollections.length, newTestCollections.length);
  });

  test("get all for user - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }

    const foundCollections = await httpService.getAllCollectionsForUser(createdUser._id);
    assert.equal(foundCollections.length, newTestCollections.length);
  });

  test("get all for user - fail, bad userId", async () => {
    try {
      await httpService.getAllCollectionsForUser("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("update - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    createdCollection.name = "My Test Collection";

    const updatedCollection = await httpService.updateCollection(createdCollection);
    assert.equal(updatedCollection.name, "My Test Collection");
  });

  test("update - fail, bad payload", async () => {
    try {
      await httpService.updateCollection(badPayload);
      assert.fail("expected 400 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 400, "expected HTTP 400 Bad Request");
    }
  });

  test("delete by id - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    const foundCollection = await httpService.getCollectionById(createdCollection._id);
    assert.isNotNull(foundCollection);
    await httpService.deleteCollection(createdCollection._id);
    try {
      await httpService.getCollectionById(createdCollection._id);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete by id - fail, bad id", async () => {
    try {
      await httpService.deleteCollection("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    let foundCollections = await httpService.getAllCollections();
    assert.equal(foundCollections.length, newTestCollections.length);

    await httpService.deleteAllCollections();

    foundCollections = await httpService.getAllCollections();
    assert.equal(foundCollections.length, 0);
  });

  test("add plant to collection - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    await httpService.addPlantToCollection(createdCollection._id, createdPlant._id);

    const foundCollection = await httpService.getCollectionById(createdCollection._id);
    assert.equal(foundCollection.plantIds[0], createdPlant._id);
  });

  test("add plant to collection - fail, bad collectionId", async () => {
    try {
      await httpService.addPlantToCollection("bad id", createdPlant._id);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("add plant to collection - fail, bad plantId", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    try {
      await httpService.addPlantToCollection(createdCollection._id, "bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete plant from collection - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    await httpService.addPlantToCollection(createdCollection._id, createdPlant._id);

    let foundCollection = await httpService.getCollectionById(createdCollection._id);
    assert.equal(foundCollection.plantIds[0], createdPlant._id);

    await httpService.deletePlantFromCollection(createdCollection._id, createdPlant._id);

    foundCollection = await httpService.getCollectionById(createdCollection._id);
    assert.equal(foundCollection.plantIds.length, 0);
  });

  test("delete plant from collection - fail, bad collectionId", async () => {
    try {
      await httpService.deletePlantFromCollection("bad id", createdPlant._id);
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("delete plant from collection - fail, bad plantId", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    try {
      await httpService.deletePlantFromCollection(createdCollection._id, "bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });

  test("get all plants for a collection - success", async () => {
    const createdCollection = await httpService.createCollectionForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const secondPlant = await httpService.createPlantForUser(createdUser._id, newTestPlants[1]);
    assert.isNotNull(secondPlant);

    await httpService.addPlantToCollection(createdCollection._id, createdPlant._id);
    await httpService.addPlantToCollection(createdCollection._id, secondPlant._id);

    const foundPlants = await httpService.getAllPlantsForCollection(createdCollection._id);
    assert.equal(foundPlants.length, 2);
  });

  test("get all plants for a collection - fail, bad collectionId", async () => {
    try {
      await httpService.getAllPlantsForCollection("bad id");
      assert.fail("expected 404 error, but request succeeded");
    } catch (error) {
      assert.equal(error.response.status, 404, "expected HTTP 404 Not Found");
    }
  });
});
