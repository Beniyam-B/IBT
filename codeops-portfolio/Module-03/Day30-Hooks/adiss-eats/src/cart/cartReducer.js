export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existingItem = state.items.find((item) => item.id === action.dish.id);

      if (!existingItem) {
        return {
          ...state,
          items: [...state.items, { ...action.dish, quantity: 1 }],
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.dish.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    case "remove": {
      const itemIndex = state.items.findIndex((item) => item.id === action.id);

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
