import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductDetail from '../\bproduct/ProductDetail';
import ProductGrid from './ProductGrid';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Main() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cart, setCart] = useState(location.state?.cart || []);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showTakeoutModal, setShowTakeoutModal] = useState(false);
  const [isTakeout, setIsTakeout] = useState(false); // ✅ 포장 여부 상태 추가

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

  useEffect(() => {
    console.log('🛒 장바구니 변경됨:', cart);
    console.log('🧾 총 수량:', totalCount);
    console.log('💰 총 금액:', totalAmount);
  }, [cart]);

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  }, [cart]);

  return (
    <div className="h-screen flex flex-col bg-[#efe9dd]">
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

      <div className="h-[33vh] bg-white shadow-inner border-t border-[#d5cfc2] px-4 py-4 overflow-y-auto rounded-t-2xl font-['Pretendard']">
        <h3 className="text-3xl font-bold mb-4 text-[#165a4a] flex items-center gap-2">
          담은 상품
        </h3>

        {cart.length === 0 ? (
          <p className="text-[#165a4a]/70 text-lg">담은 상품이 없습니다.</p>
        ) : (
          <ul className="text-base space-y-4">
            {cart.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-[#d5cfc2] pb-3"
              >
                <div>
                  <p className="text-xl font-semibold text-gray-700">
                    {item.name}
                  </p>

                  {Object.values(item.optionGroups).map((opt, i) => (
                    <p key={i} className="text-base text-gray-500">
                      - {opt.name} ({opt.price > 0 ? `+${opt.price}원` : '무료'}
                      )
                    </p>
                  ))}
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2">
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
                      className="w-6 h-6 text-base font-bold bg-[#165a4a] text-white rounded-full flex items-center justify-center hover:bg-[#104036] transition"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center text-xl font-bold text-gray-800">
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
                      className="w-6 h-6 text-base font-bold bg-[#165a4a] text-white rounded-full flex items-center justify-center hover:bg-[#104036] transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setCart(prev => prev.filter((_, i) => i !== idx))
                      }
                      className="text-[#ba1b1d] text-xs font-medium hover:underline ml-1"
                    >
                      삭제
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {(item.totalPrice * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 아래 총액 영역은 선 없애기 */}
        <div className="mt-5 flex justify-between items-center pt-3">
          <span className="font-bold text-3xl text-[#165a4a]">
            총: {totalAmount.toLocaleString()}원
          </span>
          <button
            disabled={cart.length === 0}
            onClick={() => setShowTakeoutModal(true)}
            className={`px-6 py-2 rounded-xl font-bold transition text-white text-lg shadow ${
              cart.length === 0
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-[#165a4a] hover:bg-[#104036]'
            }`}
          >
            결제하기
          </button>
        </div>
      </div>

      {showTakeoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f0eade] p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">포장하시겠습니까?</h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  setIsTakeout(true);
                  setShowTakeoutModal(false);
                  setShowRewardModal(true); // 다음 단계: 적립 여부
                }}
              >
                예
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setIsTakeout(false);
                  setShowTakeoutModal(false);
                  setShowRewardModal(true); // 다음 단계
                }}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f0eade] p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">적립 여부를 선택해주세요</h2>
            <div className="flex justify-around">
              {/* ✅ 적립하기 */}
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  // ✅ localStorage 저장
                  localStorage.setItem('cart', JSON.stringify(cart));
                  localStorage.setItem('isTakeout', isTakeout);
                  localStorage.setItem('reward', true);

                  setShowRewardModal(false);
                  navigate('/phone', {
                    state: { cart, reward: true, isTakeout },
                  });
                }}
              >
                예
              </button>

              {/* ✅ 적립 안함 */}
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  // ✅ localStorage 저장
                  localStorage.setItem('cart', JSON.stringify(cart));
                  localStorage.setItem('userId', null);
                  localStorage.setItem('phoneNumber', null);
                  localStorage.setItem('isTakeout', isTakeout);
                  localStorage.setItem('useCoupon', false);
                  localStorage.setItem('reward', false);

                  setShowRewardModal(false);
                  navigate('/checkout', {
                    state: { cart, reward: false, isTakeout },
                  });
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
