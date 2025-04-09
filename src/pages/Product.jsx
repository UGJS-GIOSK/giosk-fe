import axios from 'axios';
import { useEffect, useState, useReducer } from 'react';
import cartReducer from '../reducer/cart-reducer';
import { useNavigate } from 'react-router-dom';

function Product() {
  const [productId, setProductId] = useState('');
  const [productIdList, setProductIdList] = useState([]);
  const [product, setProduct] = useState('');
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddCart = () => {
    if (!product) return;

    const selectedProduct = {
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      optionGroups: selectedOptions,
    };

    dispatch({
      type: 'added',
      product: selectedProduct,
    });

    // 여기서 totalPrice 갱신
  };

  // 카트 뿌려야하고, 렌더링 안되게 해야할듯.

  // 상품 아이디 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/products').then(res => {
      const allProducts = res.data.data.content;
      console.log(allProducts);
      const ids = allProducts.map(p => p.product_id);
      setProductIdList(ids);
      setProductId(ids[0]);
    });
  }, []);

  // cart 상태 변경 시 총 결제 가격 계산
  useEffect(() => {
    const total = cart.reduce((sum, product) => sum + product.resultPrice, 0);
    setTotalPrice(total);
  }, [cart]);

  const handleChange = e => {
    setProductId(e.target.value);
  };

  const getProductById = () => {
    axios
      .get(`http://localhost:8080/api/v1/products/${productId}`)
      .then(res => {
        setProduct(res.data.data);
        setSelectedOptions({});
      });
  };

  const handleOptionChange = (groupId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: {
        id: option.option_id,
        name: option.option_name,
        price: option.option_price,
      },
    }));
  };

  const navigate = useNavigate();

  const goToCheckout = () => {
    navigate('/checkout', {
      state: {
        cart,
        totalPrice,
      },
    });
  };

  return (
    <>
      <h2>개별 상품정보 조회 API</h2>
      <label htmlFor="productIds">상품아이디 </label>
      <select id="productIds" value={productId} onChange={handleChange}>
        {productIdList.map(p => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
        ;
      </select>
      <button onClick={getProductById}> API 호출</button>
      {product && (
        <div>
          <h2>{product.name}</h2>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '200px' }}
          />
          <p>
            <strong>ID:</strong> {product.product_id}
          </p>
          <p>
            <strong>가격:</strong> {product.price}원
          </p>
          <h3>상세 정보</h3>
          <ul>
            <li>
              <strong>용량:</strong> {product.product_detail_info.volumeMl}
            </li>
            <li>
              <strong>칼로리:</strong> {product.product_detail_info.calories}
            </li>
            <li>
              <strong>카페인:</strong> {product.product_detail_info.caffeineMg}
              mg
            </li>
            <li>
              <strong>나트륨:</strong> {product.product_detail_info.sodiumMg}mg
            </li>
            <li>
              <strong>당류:</strong> {product.product_detail_info.sugarG}g
            </li>
            <li>
              <strong>단백질:</strong> {product.product_detail_info.proteinG}g
            </li>
            <li>
              <strong>포화지방:</strong>{' '}
              {product.product_detail_info.saturatedFatG}g
            </li>
            <li>
              <strong>알러지 정보:</strong>{' '}
              {product.product_detail_info.allergens}
            </li>
            <li>
              <strong>설명:</strong> {product.product_detail_info.description}
            </li>
          </ul>
          <h3>옵션 그룹</h3>
          {product.optionGroupResponses?.map(group => (
            <div key={group.id}>
              <strong>{group.name}</strong>
              {group.options?.map(option => (
                <li key={option.option_id}>
                  <label>
                    <input
                      type="radio"
                      name={`group-${group.id}`}
                      value={option.option_id}
                      onChange={() => handleOptionChange(group.id, option)}
                    />
                    {option.option_name}{' '}
                    {option.option_price > 0
                      ? `+${option.option_price}원`
                      : `무료`}
                  </label>
                </li>
              ))}
            </div>
          ))}
          <button onClick={handleAddCart}>담기</button>
          {console.log('cart : ', cart)}
          <h2>🛒 장바구니</h2>
          <h3>결제금액 : {totalPrice}</h3>
          {cart.length === 0 && <p>장바구니가 비어있습니다.</p>}
          <ul>
            {cart.map((product, idx) => (
              <li key={idx}>
                {product.name} - {product.price}원 × {product.quantity}개
                <ul>
                  {Object.entries(product.optionGroups).map(
                    ([groupId, option]) => (
                      <li key={groupId}>
                        옵션명: {option.name} <br />
                        옵션 가격:{' '}
                        {option.price > 0 ? `+${option.price}원` : '무료'}
                      </li>
                    ),
                  )}
                  총 가격 : {product.resultPrice}
                </ul>
              </li>
            ))}
          </ul>
          <button onClick={goToCheckout}>결제하러 가기</button>
        </div>
      )}
    </>
  );
}

export default Product;
