import { Item } from "./app/gridfinity/types/item.ts";
import { ReactElement } from "react";
import { BoxEdit } from "./app/BoxEdit.tsx";
import { BaseplateEdit } from "./app/BaseplateEdit.tsx";

export const EDIT_FORMS: Record<Item["type"], ReactElement> = {
  box: BoxEdit,
  baseplate: BaseplateEdit,
};
