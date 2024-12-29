import { EditFormProps, Item } from "./app/gridfinity/types/item.ts";
import { FC } from "react";
import { BoxEdit } from "./app/BoxEdit.tsx";
import { BaseplateEdit } from "./app/BaseplateEdit.tsx";

export const EDIT_FORMS: {
  [K in Item["type"]]: FC<EditFormProps<Extract<Item, { type: K }>>>;
} = {
  box: BoxEdit,
  baseplate: BaseplateEdit,
};
