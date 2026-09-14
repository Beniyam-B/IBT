export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const dishId = String(action.dish.id);
      const existingItem = state.items.find((item) => String(item.id) === dishId);

      if (!existingItem) {
        return {
          ...state,
          items: [...state.items, { ...action.dish, id: dishId, quantity: 1 }],
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          String(item.id) === dishId ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    case "remove": {
      const itemId = String(action.id);
      const itemIndex = state.items.findIndex((item) => String(item.id) === itemId);

      if (itemIndex === -1) {
        return state;
      }

      const nextItems = [...state.items];
      const currentItem = nextItems[itemIndex];

      if (currentItem.quantity <= 1) {
        nextItems.splice(itemIndex, 1);
      } else {
        nextItems[itemIndex] = { ...currentItem, quantity: currentItem.quantity - 1 };
      }

      return { ...state, items: nextItems };
    }
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}
