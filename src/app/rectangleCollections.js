export const rectangleCollection = {
  collection: [],
  add(rectangle) {
    this.collection.push(rectangle);
  },
  get() {
    return this.collection;
  },
};
