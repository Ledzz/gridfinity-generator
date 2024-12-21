import { Item } from "./item.ts";

export type World = {
  items: Item[];
  tolerance: number;
  profileFillet: number;
};
