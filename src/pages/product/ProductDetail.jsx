import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductIngredient from './ProductIngredient'; // ✅ import

export default function ProductDetail({ productId, onClose, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showIngredients, setShowIngredients] = useState(false); // ✅ 이 줄 추가!!

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/products/${productId}`)
      .then(res => setProduct(res.data.data))
      .catch(err => console.error('상품 상세 정보 로딩 실패', err));
  }, [productId]);

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

  const handleAddToCart = () => {
    const totalOptionPrice = Object.values(selectedOptions).reduce(
      (sum, opt) => sum + opt.price,
      0,
    );

    const selectedProduct = {
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image,
      optionGroups: selectedOptions,
      quantity: 1,
      totalPrice: product.price + totalOptionPrice, // ✅ 필수
    };
    console.log('🛒 담긴 상품:', selectedProduct);
    onAddToCart(selectedProduct);
    onClose(); // 모달 닫기
  };

  if (!product) return <div>로딩 중...</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl">
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

        <img
          src={product.image}
          alt={product.name}
          className="w-full max-h-60 object-contain mb-4"
        />

        <p className="text-xl font-semibold mb-2">
          {product.price.toLocaleString()}원
        </p>

        <p className="text-gray-700 mb-4">
          {product.product_detail_info.description}
        </p>

        {/* ✅ 성분 정보 보기 버튼 */}
        <button
          onClick={() => setShowIngredients(true)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          성분 정보 보기
        </button>

        {/* 옵션 */}
        <div className="mt-4">
          <h3 className="font-bold mb-2">옵션</h3>
          {product.optionGroupResponses?.map(group => (
            <div key={group.id} className="mb-4">
              <p className="font-medium mb-1">{group.name}</p>
              <div className="flex flex-wrap gap-3">
                {group.options?.map(option => (
                  <label
                    key={option.option_id}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="radio"
                      name={`group-${group.id}`}
                      onChange={() => handleOptionChange(group.id, option)}
                    />
                    {option.option_name}
                    {option.option_price > 0 && (
                      <span className="text-sm text-gray-500">
                        (+{option.option_price.toLocaleString()}원)
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {Object.entries(selectedOptions).length > 0 && (
          <div className="mt-6 border-t pt-4 text-sm text-gray-700">
            <h4 className="font-semibold mb-2">선택된 옵션</h4>
            <ul className="list-disc list-inside">
              {Object.entries(selectedOptions).map(([groupId, option]) => (
                <li key={groupId}>
                  {option.name} (
                  {option.price > 0
                    ? `+${option.price.toLocaleString()}원`
                    : '무료'}
                  )
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={
            product.optionGroupResponses?.length > 0 &&
            Object.keys(selectedOptions).length !==
              product.optionGroupResponses.length
          }
          className={`mt-6 w-full py-3 rounded-xl text-lg font-bold transition ${
            product.optionGroupResponses?.length > 0 &&
            Object.keys(selectedOptions).length !==
              product.optionGroupResponses.length
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-700 text-white hover:bg-green-800'
          }`}
        >
          장바구니 담기
        </button>
      </div>

      {/* ✅ 성분 모달 */}
      {showIngredients && (
        <ProductIngredient
          detailInfo={product.product_detail_info}
          onClose={() => setShowIngredients(false)}
        />
      )}
    </div>
  );
}
