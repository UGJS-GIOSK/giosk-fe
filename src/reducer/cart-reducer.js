export default function cartReducer(cart, action) {
  // state : 상태관리대상
  // action : dispatch()를 통해 전달되는, 비즈니스 로직 처리를 위한 객체

  switch (action.type) {
    case 'added': {
      const { product } = action;

      // 옵션 가격 총합 계산
      const totalOptionPrice = Object.values(product.optionGroups || {}).reduce(
        (sum, [, , optionPrice]) => sum + (optionPrice || 0),
        0,
      );

      const resultPrice = product.price + totalOptionPrice;

      // 같은 상품 + 같은 옵션 조합 찾기
      const existingItem = cart.find(
        item =>
          item.product_id === product.product_id &&
          JSON.stringify(item.optionGroups) ===
            JSON.stringify(product.optionGroups),
      );

      if (existingItem) {
        // 수량만 증가
        return cart.map(item =>
          item.product_id === product.product_id &&
          JSON.stringify(item.optionGroups) ===
            JSON.stringify(product.optionGroups)
            ? {
                ...item,
                quantity: item.quantity + 1,
                resultPrice: (item.quantity + 1) * resultPrice,
              }
            : item,
        );
      }

      return [
        ...cart,
        {
          ...product,
          quantity: 1,
          resultPrice: resultPrice,
          // 옵션에 있는 가격까지 추가해서 price 표시
        },
      ];
    }

    default: {
      throw Error('알 수 없는 액션 타입: ' + action.type);
    }
  }
}
