import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDetail from '../\bproduct/ProductDetail';
import ProductGrid from './ProductGrid';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cart, setCart] = useState([]);
  const [showRewardModal, setShowRewardModal] = useState(false); // 적립 모달 여부
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/categories?page=${page}&size=5`,
        { withCredentials: true },
      );
      const content = res.data.data.content;
      const last = res.data.data.last;
      setCategories(content);
      setIsLastPage(last);
      if (content.length > 0) {
        setSelectedCategory(content[0]);
      }
    } catch (err) {
      console.error('카테고리 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  return (
    <div className="h-screen flex flex-col bg-[#efe9dd]">
      {/* 카테고리 선택 바 */}
      <div className="sticky top-0 z-10 bg-[#efe9dd] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            ◀
          </button>
          <div className="flex gap-3 overflow-x-auto">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 font-bold px-4 py-2 rounded-full shadow whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={isLastPage}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 상품 영역 (상단 2/3) */}
      <div className="flex-grow overflow-y-auto">
        {selectedProductId ? (
          <ProductDetail
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
            onAddToCart={product => setCart(prev => [...prev, product])}
          />
        ) : (
          <ProductGrid
            category={selectedCategory}
            onSelectProduct={setSelectedProductId}
          />
        )}
      </div>

      {/* 장바구니 영역 (하단 1/3) */}
      <div className="h-[33vh] bg-white shadow-inner border-t px-4 py-3 overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">🛒 장바구니</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">담은 상품이 없습니다.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {cart.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                {/* 왼쪽: 상품명 + 옵션 */}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {Object.values(item.optionGroups).map((opt, i) => (
                    <p key={i} className="text-gray-500 text-xs">
                      - {opt.name} ({opt.price > 0 ? `+${opt.price}원` : '무료'}
                      )
                    </p>
                  ))}
                </div>

                {/* 오른쪽: 수량조정 + 가격 */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() =>
                        setCart(prev =>
                          prev.map((p, i) =>
                            i === idx && p.quantity > 1
                              ? { ...p, quantity: p.quantity - 1 }
                              : p,
                          ),
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setCart(prev =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, quantity: p.quantity + 1 } : p,
                          ),
                        )
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setCart(prev => prev.filter((_, i) => i !== idx))
                      }
                      className="text-red-500 text-xs hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                  <p className="font-bold">
                    {(item.totalPrice * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex justify-between items-center">
          <span className="font-bold text-lg">
            총:{' '}
            {cart
              .reduce((sum, item) => sum + item.totalPrice * item.quantity, 0)
              .toLocaleString()}
            원 원
          </span>
          <button
            disabled={cart.length === 0}
            onClick={() => setShowRewardModal(true)} // ✅ 클릭 시 모달 띄움
            className={`px-4 py-2 rounded-xl font-bold transition ${
              cart.length === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {cart.length === 0 ? '선택한 상품 없음' : '결제하기'}
          </button>
        </div>
      </div>

      {/* 적립하시겠습니까? */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">적립하시겠습니까?</h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  setShowRewardModal(false);
                  navigate('/phone', { state: { cart } }); // ✅ 적립 → 전화번호 입력 페이지
                }}
              >
                예
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setShowRewardModal(false);
                  navigate('/checkout', { state: { cart } }); // ✅ 결제 → 결제 페이지
                }}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
