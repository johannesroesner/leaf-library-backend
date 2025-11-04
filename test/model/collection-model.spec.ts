import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { dataBase } from "../../src/model/db.js";
// @ts-ignore
import { newTestCollections, newTestPlants, newTestUsers } from "../fixture.js";
import type { User } from "../../src/model/interface/user";
import { Plant } from "../../src/model/interface/plant";

suite("collection model tests", () => {
  let createdUser: User;
  let createdPlants: Plant[] = [];

  setup(async () => {
    createdPlants = [];
    dataBase.init("json");
    await dataBase.userStore!.deleteAll();
    await dataBase.plantStore!.deleteAll();
    await dataBase.collectionStore!.deleteAll();

    createdUser = await dataBase.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
      createdPlants = [...createdPlants, createdPlant];
    }
  });

  test("create - success", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    assert.equal(newTestCollections[0].name, createdCollection.name);
    assert.equal(createdUser._id, createdCollection.userId);
  });

  test("get by id  - success", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    const foundCollection = await dataBase.collectionStore!.getById(createdCollection._id);
    assert.isNotNull(foundCollection);
    assert.deepEqual(createdCollection, foundCollection);
  });

  test("get by id  - fail", async () => {
    const foundCollection = await dataBase.collectionStore!.getById("bad id");
    assert.isNull(foundCollection);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    const foundCollections = await dataBase.collectionStore!.getAll();
    assert.equal(newTestCollections.length, foundCollections.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    let foundCollections = await dataBase.collectionStore!.getAll();
    assert.equal(newTestCollections.length, foundCollections.length);

    await dataBase.collectionStore!.deleteAll();
    foundCollections = await dataBase.collectionStore!.getAll();
    assert.equal(foundCollections.length, 0);
  });

  test("delete by id - success", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);
    let foundCollection = await dataBase.collectionStore!.getById(createdCollection._id);
    assert.isNotNull(foundCollection);

    const deletedCollection = await dataBase.collectionStore!.deleteById(createdCollection._id);
    assert.isNotNull(deletedCollection);

    foundCollection = await dataBase.collectionStore!.getById(createdCollection._id);
    assert.isNull(foundCollection);
  });

  test("delete by id - fail", async () => {
    const deletedCollection = await dataBase.collectionStore!.deleteById("bad id");
    assert.isNull(deletedCollection);
  });

  test("update - success", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    createdCollection.name = "new name";

    const updatedCollection = await dataBase.collectionStore!.update(createdCollection);
    assert.isNotNull(updatedCollection);

    const foundCollection = await dataBase.collectionStore!.getById(createdCollection._id);
    assert.isNotNull(foundCollection);

    assert.equal(foundCollection.name, "new name");
  });

  test("update - fail", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    createdCollection._id = "bad id";

    const updatedCollection = await dataBase.collectionStore!.update(createdCollection);
    assert.isNull(updatedCollection);
  });

  test("get all for user - success", async () => {
    for (let i = 0; i < newTestCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[i]);
      assert.isNotNull(createdCollection);
    }
    const foundCollections = await dataBase.collectionStore!.getAllForUser(createdUser._id);
    assert.equal(newTestCollections.length, foundCollections.length);
  });

  test("get all for user - fail", async () => {
    const foundCollections = await dataBase.collectionStore!.getAllForUser("bad id");
    assert.equal(0, foundCollections.length);
  });

  test("add one plant to collection - success", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const createdCollectionWithPlant = await dataBase.collectionStore!.addPlantToCollection(createdCollection._id, createdPlants[0]._id);
    assert.isNotNull(createdCollectionWithPlant);

    assert.equal(createdCollectionWithPlant.plantIds[0], createdPlants[0]._id);
  });

  test("add one plant to collection - fail, bad collectionId", async () => {
    const createdCollectionWithPlant = await dataBase.collectionStore!.addPlantToCollection("bad id", createdPlants[0]._id);
    assert.isNull(createdCollectionWithPlant);
  });

  test("add one plant to collection - fail, bad plantId", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    const createdCollectionWithPlant = await dataBase.collectionStore!.addPlantToCollection(createdCollection._id, "bad id");
    assert.isNull(createdCollectionWithPlant);
  });

  test("get all plants for collection - success", async () => {
    const createdCollection = await dataBase.collectionStore!.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    for (let i = 0; i < createdPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdCollectionWithPlant = await dataBase.collectionStore!.addPlantToCollection(createdCollection._id, createdPlants[i]._id);
      assert.isNotNull(createdCollectionWithPlant);
    }

    const foundPlants = await dataBase.collectionStore!.getAllPlantsForCollection(createdCollection._id);
    assert.equal(createdPlants.length, foundPlants.length);
  });
});
