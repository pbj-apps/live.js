interface ItemNode {
  quantity: number;
}

interface Item {
  node: ItemNode;
}

export const getItemCount = (items: Item[]): number => {
  // go through items and get the total quantity
  return items.reduce((acc, { node }) => {
    const { quantity } = node;
    return acc + quantity;
  }, 0);
};
