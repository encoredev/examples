interface IEntityName {
  [key: string]: {
    collectionName: string;
    tableName: string;
  };
}

export const EntitiesName: IEntityName = {
  cat: {
    collectionName: "cat",
    tableName: "cats",
  },
};
