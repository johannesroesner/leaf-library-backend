import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { dataBase } from "../../src/model/db.js";
// @ts-ignore
import { newTestPlants, newTestUsers } from "../fixture.js";
import type { User } from "../../src/model/interface/user";

suite("plant model tests", () => {
  let createdUser: User;

  setup(async () => {
    dataBase.init("json");
    await dataBase.plantStore!.deleteAll();

    createdUser = await dataBase.userStore!.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
  });

  test("create - success", async () => {
    const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    assert.equal(newTestPlants[0].type, createdPlant.type);
    assert.equal(createdUser._id, createdPlant.userId);
  });

  test("get by id  - success", async () => {
    const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    const foundPlant = await dataBase.plantStore!.getById(createdPlant._id);
    assert.isNotNull(foundPlant);
    assert.deepEqual(createdPlant, foundPlant);
  });

  test("get by id  - fail", async () => {
    const foundPlant = await dataBase.plantStore!.getById("bad id");
    assert.isNull(foundPlant);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    const foundPlants = await dataBase.plantStore!.getAll();
    assert.equal(newTestUsers.length, foundPlants.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    let foundPlants = await dataBase.plantStore!.getAll();
    assert.equal(newTestUsers.length, foundPlants.length);

    await dataBase.plantStore!.deleteAll();
    foundPlants = await dataBase.plantStore!.getAll();
    assert.equal(foundPlants.length, 0);
  });

  test("delete by id - success", async () => {
    const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);
    let foundPlant = await dataBase.plantStore!.getById(createdPlant._id);
    assert.isNotNull(foundPlant);

    const deletedPlant = await dataBase.plantStore!.deleteById(createdPlant._id);
    assert.isNotNull(deletedPlant);

    foundPlant = await dataBase.plantStore!.getById(createdPlant._id);
    assert.isNull(foundPlant);
  });

  test("delete by id - fail", async () => {
    const deletedUser = await dataBase.userStore!.deleteById("bad id");
    assert.isNull(deletedUser);
  });

  test("update by id - success", async () => {
    const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);

    createdPlant.commonName = "new name";

    const updatedPlant = await dataBase.plantStore!.update(createdPlant);
    assert.isNotNull(updatedPlant);

    const foundPlant = await dataBase.plantStore!.getById(createdPlant._id);
    assert.isNotNull(foundPlant);

    assert.equal(foundPlant.commonName, "new name");
  });

  test("get all for user - success", async () => {
    for (let i = 0; i < newTestPlants.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await dataBase.plantStore!.createForUser(createdUser._id, newTestPlants[i]);
      assert.isNotNull(createdPlant);
    }
    const foundPlants = await dataBase.plantStore!.getAllForUser(createdUser._id);
    assert.equal(newTestUsers.length, foundPlants.length);
  });

  test("get all for user - fail", async () => {
    const foundPlants = await dataBase.plantStore!.getAllForUser("bad id");
    assert.equal(0, foundPlants.length);
  });
});
