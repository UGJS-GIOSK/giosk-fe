import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductIngredient from './ProductIngredient';

export default function ProductDetail({ productId, onClose, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showIngredients, setShowIngredients] = useState(false);

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
      totalPrice: product.price + totalOptionPrice,
    };

    onAddToCart(selectedProduct);
    onClose();
  };

  if (!product) return <div>로딩 중...</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
        >
          ✖
        </button>

        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

        {/* 이미지 */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain mb-4"
        />

        {/* 가격 */}
        <p className="text-lg font-semibold text-[#165a4a] mb-2">
          {product.price.toLocaleString()}원
        </p>

        {/* 설명 */}
        <p className="text-gray-700 mb-4">
          {product.product_detail_info.description}
        </p>

        {/* 성분 정보 보기 */}
        <button
          onClick={() => setShowIngredients(true)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          성분 정보 보기
        </button>

        {/* 옵션 그룹 */}
        {product.optionGroupResponses?.map(group => (
          <div key={group.id} className="mb-4">
            <p className="font-semibold mb-1">{group.name}</p>
            <div className="flex flex-wrap gap-2">
              {group.options?.map(option => {
                const isSelected =
                  selectedOptions[group.id]?.id === option.option_id;
                return (
                  <label
                    key={option.option_id}
                    onClick={() => handleOptionChange(group.id, option)}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold border transition
                    ${
                      isSelected
                        ? 'bg-[#165a4a] text-white border-[#165a4a]'
                        : 'bg-white text-[#165a4a] border-[#165a4a]/30 hover:bg-[#f0eade]'
                    }`}
                  >
                    {option.option_name}
                    {option.option_price > 0 && (
                      <span className="ml-1 text-xs font-normal">
                        (+{option.option_price.toLocaleString()}원)
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* 선택된 옵션 */}
        {Object.entries(selectedOptions).length > 0 && (
          <div className="mt-4 border-t border-[#d5cfc2] pt-4 text-sm text-[#165a4a]">
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

        {/* 장바구니 담기 버튼 */}
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
              : 'bg-[#165a4a] text-white hover:bg-[#104036]'
          }`}
        >
          장바구니 담기
        </button>
      </div>

      {/* 성분 정보 모달 */}
      {showIngredients && (
        <ProductIngredient
          detailInfo={product.product_detail_info}
          onClose={() => setShowIngredients(false)}
        />
      )}
    </div>
  );
}
