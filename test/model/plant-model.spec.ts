import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { database } from "../../src/model/database.js";
// @ts-ignore
import { newTestPlants, newTestUsers } from "../fixture.js";
import type { User } from "../../src/model/interface/user";

suite("plant model tests", () => {
  let createdUser: User;

  setup(async () => {
    database.init("json");
    await database.userStore!.deleteAll();
    await database.plantStore!.deleteAll();
    await database.collectionStore!.deleteAll();

    createdUser = await database.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
  });

  test("create - success", async () => {
    const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    assert.equal(newTestPlants[0].type, createdPlant.type);
    assert.equal(createdUser._id, createdPlant.userId);
  });

  test("get by id  - success", async () => {
    const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    const foundPlant = await database.plantStore!.getById(createdPlant._id);
    assert.isNotNull(foundPlant);
    assert.deepEqual(createdPlant, foundPlant);
  });

  test("get by id  - fail, bad plantId", async () => {
    const foundPlant = await database.plantStore!.getById("bad id");
    assert.isNull(foundPlant);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    const foundPlants = await database.plantStore!.getAll();
    assert.equal(newTestPlants.length, foundPlants.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    let foundPlants = await database.plantStore!.getAll();
    assert.equal(newTestPlants.length, foundPlants.length);

    await database.plantStore!.deleteAll();
    foundPlants = await database.plantStore!.getAll();
    assert.equal(foundPlants.length, 0);
  });

  test("delete by id - success", async () => {
    const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    let foundPlant = await database.plantStore!.getById(createdPlant._id);
    assert.isNotNull(foundPlant);

    const deletedPlant = await database.plantStore!.deleteById(createdPlant._id);
    assert.isNotNull(deletedPlant);

    foundPlant = await database.plantStore!.getById(createdPlant._id);
    assert.isNull(foundPlant);
  });

  test("delete by id - fail, bad plantId", async () => {
    const deletedPlant = await database.plantStore!.deleteById("bad id");
    assert.isNull(deletedPlant);
  });

  test("update - success", async () => {
    const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);

    createdPlant.commonName = "new name";

    const updatedPlant = await database.plantStore!.update(createdPlant);
    assert.isNotNull(updatedPlant);

    const foundPlant = await database.plantStore!.getById(createdPlant._id);
    assert.isNotNull(foundPlant);

    assert.equal(foundPlant.commonName, "new name");
  });

  test("update - fail, bad plantId", async () => {
    const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);

    createdPlant._id = "bad id";

    const updatedPlant = await database.plantStore!.update(createdPlant);
    assert.isNull(updatedPlant);
  });

  test("get all for user - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await database.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    const foundPlants = await database.plantStore!.getAllForUser(createdUser._id);
    assert.equal(newTestPlants.length, foundPlants.length);
  });

  test("get all for user - fail, bad userId", async () => {
    const foundPlants = await database.plantStore!.getAllForUser("bad id");
    assert.equal(0, foundPlants.length);
  });
});
