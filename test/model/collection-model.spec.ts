import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { database } from "../../src/model/database.js";
// @ts-ignore
import { newTestCollections, newTestPlants, newTestUsers } from "../fixture.js";
import type { User } from "../../src/model/interface/user";
import { Plant } from "../../src/model/interface/plant";

suite("collection model tests", () => {
  let createdUser: User;
  let createdPlants: Plant[] = [];

  setup(async () => {
    createdPlants = [];
    await database.init("json");
    await database.userStore.deleteAll();
    await database.plantStore.deleteAll();
    await database.collectionStore.deleteAll();

    createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await database.plantStore.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
      createdPlants = [...createdPlants, createdPlant];
    }
  });

  test("create - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    assert.equal(newTestCollections[0].name, createdCollection.name);
    assert.equal(createdUser._id, createdCollection.userId);
  });

  test("create - fail, bad userId", async () => {
    const createdCollection = await database.collectionStore.createForUser("bad id", newTestCollections[0]);
    assert.isNull(createdCollection);
  });

  test("get by id  - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    const foundCollection = await database.collectionStore.getById(createdCollection._id);
    assert.isNotNull(foundCollection);
    assert.deepEqual(createdCollection, foundCollection);
  });

  test("get by id  - fail, bad collectionId", async () => {
    const foundCollection = await database.collectionStore.getById("bad id");
    assert.isNull(foundCollection);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    const foundCollections = await database.collectionStore.getAll();
    assert.equal(newTestCollections.length, foundCollections.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    let foundCollections = await database.collectionStore.getAll();
    assert.equal(newTestCollections.length, foundCollections.length);

    await database.collectionStore.deleteAll();
    foundCollections = await database.collectionStore.getAll();
    assert.equal(foundCollections.length, 0);
  });

  test("delete by id - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    let foundCollection = await database.collectionStore.getById(createdCollection._id);
    assert.isNotNull(foundCollection);

    const deletedCollection = await database.collectionStore.deleteById(createdCollection._id);
    assert.isNotNull(deletedCollection);

    foundCollection = await database.collectionStore.getById(createdCollection._id);
    assert.isNull(foundCollection);
  });

  test("delete by id - fail, bad collectionId", async () => {
    const deletedCollection = await database.collectionStore.deleteById("bad id");
    assert.isNull(deletedCollection);
  });

  test("update - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    createdCollection.name = "new name";

    const updatedCollection = await database.collectionStore.update(createdCollection);
    assert.isNotNull(updatedCollection);

    const foundCollection = await database.collectionStore.getById(createdCollection._id);
    assert.isNotNull(foundCollection);

    assert.equal(foundCollection.name, "new name");
  });

  test("update - fail, bad collectionId", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    createdCollection._id = "bad id";

    const updatedCollection = await database.collectionStore.update(createdCollection);
    assert.isNull(updatedCollection);
  });

  test("get all for user - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    const foundCollections = await database.collectionStore.getAllForUser(createdUser._id);
    assert.equal(newTestCollections.length, foundCollections.length);
  });

  test("get all for user - fail, bad userId", async () => {
    const foundCollections = await database.collectionStore.getAllForUser("bad id");
    assert.isNull(foundCollections);
  });

  test("add one plant to collection - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const createdCollectionWithPlant = await database.collectionStore.addPlantToCollection(createdCollection._id, createdPlants[0]._id);
    assert.isNotNull(createdCollectionWithPlant);

    assert.equal(createdCollectionWithPlant.plantIds[0], createdPlants[0]._id);
  });

  test("add one plant to collection - fail, bad collectionId", async () => {
    const createdCollectionWithPlant = await database.collectionStore.addPlantToCollection("bad id", createdPlants[0]._id);
    assert.isNull(createdCollectionWithPlant);
  });

  test("add one plant to collection - fail, bad plantId", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const createdCollectionWithPlant = await database.collectionStore.addPlantToCollection(createdCollection._id, "bad id");
    assert.isNull(createdCollectionWithPlant);
  });

  test("get all plants for collection - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    for (let i = 0; i < createdPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollectionWithPlant = await database.collectionStore.addPlantToCollection(createdCollection._id, createdPlants[i]._id);
      assert.isNotNull(createdCollectionWithPlant);
    }

    const foundPlants = await database.collectionStore.getAllPlantsForCollection(createdCollection._id);
    assert.equal(createdPlants.length, foundPlants.length);
  });

  test("add one plant to collection, delete the plant - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const createdCollectionWithPlant = await database.collectionStore.addPlantToCollection(createdCollection._id, createdPlants[0]._id);
    assert.isNotNull(createdCollectionWithPlant);

    assert.equal(createdCollectionWithPlant.plantIds[0], createdPlants[0]._id);

    await database.plantStore!.deleteById(createdPlants[0]._id);

    const foundCollection = await database.collectionStore.getById(createdCollection._id);

    assert.equal(foundCollection.plantIds.length, 0);
  });

  test("delete one plant from collection - success", async () => {
    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const createdCollectionWithPlant = await database.collectionStore.addPlantToCollection(createdCollection._id, createdPlants[0]._id);
    assert.isNotNull(createdCollectionWithPlant);

    assert.equal(createdCollectionWithPlant.plantIds[0], createdPlants[0]._id);

    const createdCollectionWithoutPlant = await database.collectionStore.deletePlantFromCollection(createdCollectionWithPlant._id, createdCollectionWithPlant.plantIds[0]);
    assert.isNotNull(createdCollectionWithoutPlant);

    assert.equal(createdCollectionWithoutPlant.plantIds.length, 0);
  });

  test("add one plant to collection - fail, bad collectionId", async () => {
    const createdCollectionWithoutPlant = await database.collectionStore.deletePlantFromCollection("bad id", createdPlants[0]._id);
    assert.isNull(createdCollectionWithoutPlant);
  });
});
