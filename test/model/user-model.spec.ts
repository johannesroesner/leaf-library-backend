import { suite, test, setup } from "mocha";
import { assert } from "chai";
import { database } from "../../src/model/database.js";
// @ts-ignore
import { newTestCollections, newTestPlants, newTestUsers } from "../fixture.js";

suite("user model tests", () => {
  setup(async () => {
    database.init("json");
    await database.userStore.deleteAll();
    await database.plantStore.deleteAll();
    await database.collectionStore.deleteAll();
  });

  test("create - success", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    assert.equal(newTestUsers[0].email, createdUser.email);
  });

  test("get by id  - success", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    const foundUser = await database.userStore.getById(createdUser._id);
    assert.isNotNull(foundUser);
    assert.deepEqual(createdUser, foundUser);
  });

  test("get by id  - fail, bad userId", async () => {
    const foundUser = await database.userStore.getById("bad id");
    assert.isNull(foundUser);
  });

  test("get by email  - success", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    const foundUser = await database.userStore.getByEmail(createdUser.email);
    assert.isNotNull(foundUser);
    assert.deepEqual(createdUser, foundUser);
  });

  test("get by email  - fail, bad userEmail", async () => {
    const foundUser = await database.userStore.getByEmail("bad email");
    assert.isNull(foundUser);
  });

  test("get all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await database.userStore.create(newTestUsers[i]);
      assert.isNotNull(createdUser);
    }
    const foundUsers = await database.userStore.getAll();
    assert.equal(newTestUsers.length, foundUsers.length);
  });

  test("delete all - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await database.userStore.create(newTestUsers[0]);
      assert.isNotNull(createdUser);
    }
    let foundUsers = await database.userStore.getAll();
    assert.equal(newTestUsers.length, foundUsers.length);

    await database.userStore.deleteAll();
    foundUsers = await database.userStore.getAll();
    assert.equal(foundUsers.length, 0);
  });

  test("delete by id - success", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);
    let foundUser = await database.userStore.getById(createdUser._id);
    assert.isNotNull(foundUser);

    const deletedUser = await database.userStore.deleteById(createdUser._id);
    assert.isNotNull(deletedUser);

    foundUser = await database.userStore.getById(createdUser._id);
    assert.isNull(foundUser);
  });

  test("delete by id - fail, bad userId", async () => {
    const deletedUser = await database.userStore.deleteById("bad id");
    assert.isNull(deletedUser);
  });

  test("update - success", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    createdUser.firstName = "new name";

    const updatedUser = await database.userStore.update(createdUser);
    assert.isNotNull(updatedUser);

    const foundUser = await database.userStore.getById(createdUser._id);
    assert.isNotNull(foundUser);

    assert.equal(foundUser.firstName, "new name");
  });

  test("update - fail, bad userId", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    createdUser._id = "bad id";

    const updatedUser = await database.userStore.update(createdUser);
    assert.isNull(updatedUser);
  });

  test("delete by id and the users plants/collection  - success", async () => {
    const createdUser = await database.userStore.create(newTestUsers[0]);
    assert.isNotNull(createdUser);

    const createdPlant = await database.plantStore.createForUser(createdUser._id, newTestPlants[0]);
    assert.isNotNull(createdPlant);

    const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
    assert.isNotNull(createdCollection);

    await database.userStore.deleteById(createdUser._id);
    const foundUser = await database.userStore.getById(createdUser._id);
    assert.isNull(foundUser);

    const foundPlant = await database.plantStore.getById(createdPlant._id);
    assert.isNull(foundPlant);

    const foundCollection = await database.collectionStore.getById(createdCollection._id);
    assert.isNull(foundCollection);
  });

  test("delete all and all plants/collection  - success", async () => {
    for (let i = 0; i < newTestUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const createdUser = await database.userStore.create(newTestUsers[0]);
      assert.isNotNull(createdUser);

      // eslint-disable-next-line no-await-in-loop
      const createdPlant = await database.plantStore.createForUser(createdUser._id, newTestPlants[0]);
      assert.isNotNull(createdPlant);

      // eslint-disable-next-line no-await-in-loop
      const createdCollection = await database.collectionStore.createForUser(createdUser._id, newTestCollections[0]);
      assert.isNotNull(createdCollection);
    }

    await database.userStore.deleteAll();

    const foundUsers = await database.userStore.getAll();
    assert.equal(foundUsers.length, 0);

    const foundPlants = await database.plantStore.getAll();
    assert.equal(foundPlants.length, 0);

    const foundCollections = await database.collectionStore.getAll();
    assert.equal(foundCollections.length, 0);
  });
});
