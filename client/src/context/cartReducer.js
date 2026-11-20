
const getCustomizationKey = (item) =>
  JSON.stringify([
    String(item.productId),
    Boolean(item.isEggless),
    item.deliveryDate,
    (item.cakeMessage || '').trim()
  ]);

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const newKey = getCustomizationKey(newItem);

      const existingItem = state.find(
        item => getCustomizationKey(item) === newKey
      );

      if (existingItem) {
        return state.map(item =>
          getCustomizationKey(item) === newKey
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity
              }
            : item
        );
      }

      return [...state, newItem];
    }

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        getCustomizationKey(item) === action.payload.key
          ? {
              ...item,
              quantity: action.payload.quantity
            }
          : item
      );

    case 'REMOVE_ITEM':
      return state.filter(
        item => getCustomizationKey(item) !== action.payload
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export { getCustomizationKey };
