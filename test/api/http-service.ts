import axios from "axios";
// @ts-ignore
import { serviceUrl } from "../fixture.js";
import { User } from "../../src/model/interface/user.js";
import { Plant } from "../../src/model/interface/plant";
import { Collection } from "../../src/model/interface/collection";

export const httpService = {
  leafLibraryBackendUrl: serviceUrl,

  // user api
  async getAllUsers() {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/user/all`);
    return response.data;
  },

  async getUserById(userId: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/user/${userId}`);
    return response.data;
  },

  async getUserByEmail(userEmail: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/user/byEmail/${userEmail}`);
    return response.data;
  },

  async createUser(user: User) {
    const response = await axios.post(`${this.leafLibraryBackendUrl}/api/user/create`, user);
    return response.data;
  },

  async updateUser(user: User) {
    const response = await axios.put(`${this.leafLibraryBackendUrl}/api/user/update`, user);
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/user/${userId}/delete`);
    return response.data;
  },

  async deleteAllUsers() {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/user/delete/all`);
    return response.data;
  },

  // plant api
  async getAllPlants() {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/plant/all`);
    return response.data;
  },

  async getPlantById(plantId: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/plant/${plantId}`);
    return response.data;
  },

  async getAllPlantsForUser(userId: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/plant/all/forUserId/${userId}`);
    return response.data;
  },

  async createPlantForUser(userId: string, plant: string) {
    const response = await axios.post(`${this.leafLibraryBackendUrl}/api/plant/create/forUserId/${userId}`, plant);
    return response.data;
  },

  async updatePlant(plant: Plant) {
    const response = await axios.put(`${this.leafLibraryBackendUrl}/api/plant/update`, plant);
    return response.data;
  },

  async deletePlant(plantId: string) {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/plant/${plantId}/delete`);
    return response.data;
  },

  async deleteAllPlants() {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/plant/delete/all`);
    return response.data;
  },

  // collection api
  async getAllCollections() {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/collection/all`);
    return response.data;
  },

  async getCollectionById(collectionId: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/collection/${collectionId}`);
    return response.data;
  },

  async getAllCollectionsForUser(userId: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/collection/all/forUserId/${userId}`);
    return response.data;
  },

  async createCollectionForUser(userId: string, collection: Collection) {
    const response = await axios.post(`${this.leafLibraryBackendUrl}/api/collection/create/forUserId/${userId}`, collection);
    return response.data;
  },

  async updateCollection(collection: Collection) {
    const response = await axios.put(`${this.leafLibraryBackendUrl}/api/collection/update`, collection);
    return response.data;
  },

  async deleteCollection(collectionId: string) {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/collection/delete/${collectionId}`);
    return response.data;
  },

  async deleteAllCollections() {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/collection/delete/all`);
    return response.data;
  },

  async addPlantToCollection(collectionId: string, plantId: string) {
    const response = await axios.post(`${this.leafLibraryBackendUrl}/api/collection/${collectionId}/addPlant/${plantId}`);
    return response.data;
  },

  async deletePlantFromCollection(collectionId: string, plantId: string) {
    const response = await axios.delete(`${this.leafLibraryBackendUrl}/api/collection/${collectionId}/deletePlant/${plantId}`);
    return response.data;
  },

  async getAllPlantsForCollection(collectionId: string) {
    const response = await axios.get(`${this.leafLibraryBackendUrl}/api/collection/${collectionId}/plants`);
    return response.data;
  },
};
