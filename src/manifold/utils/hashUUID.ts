export const hashUUID = (uuid: string) => {
  return parseInt(uuid.split("-")[0], 16);
};
