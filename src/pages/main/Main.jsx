import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductDetail from '../product/ProductDetail';
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
  const [isTakeout, setIsTakeout] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/categories?page=${page}&size=5`,
        { withCredentials: true },
      );
      const { content, last } = res.data.data;
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

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0),
    [cart],
  );

  return (
    <div className="h-screen flex flex-col bg-[#efe9dd] font-['Pretendard']">
      {/* 카테고리 */}
      <div className="sticky top-0 z-10 bg-[#efe9dd] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            ◀
          </button>
          <div className="flex gap-3 overflow-x-auto min-w-0">
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

      {/* 상품 or 상세 */}
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

      {/* 장바구니 */}
      <div className="bg-white shadow-inner border-t border-[#d5cfc2] px-4 pt-4">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-[#165a4a] flex items-center gap-2">
          담은 상품
        </h3>

        {/* 장바구니 목록 */}
        <div className="max-h-[20vh] overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <p className="text-[#165a4a]/70 text-base sm:text-lg">
              담은 상품이 없습니다.
            </p>
          ) : (
            <ul className="text-sm sm:text-base space-y-4">
              {cart.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b border-[#d5cfc2] pb-3"
                >
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-gray-700">
                      {item.name}
                    </p>
                    {Object.values(item.optionGroups).map((opt, i) => (
                      <p key={i} className="text-sm sm:text-base text-gray-500">
                        - {opt.name} (
                        {opt.price > 0 ? `+${opt.price}원` : '무료'})
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
                        className="w-7 h-7 text-base font-bold bg-[#165a4a] text-white rounded-full flex items-center justify-center hover:bg-[#104036] transition"
                      >
                        −
                      </button>
                      <span className="min-w-[24px] text-center text-base font-semibold text-[#165a4a]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setCart(prev =>
                            prev.map((p, i) =>
                              i === idx
                                ? { ...p, quantity: p.quantity + 1 }
                                : p,
                            ),
                          )
                        }
                        className="w-7 h-7 text-base font-bold bg-[#165a4a] text-white rounded-full flex items-center justify-center hover:bg-[#104036] transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          setCart(prev => prev.filter((_, i) => i !== idx))
                        }
                        className="text-[#ba1b1d] text-xs sm:text-sm font-semibold hover:underline ml-1"
                      >
                        삭제
                      </button>
                    </div>
                    <p className="text-base font-bold text-gray-800">
                      {(item.totalPrice * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 결제 버튼 */}
        <div className="sticky bottom-0 bg-white pt-3 pb-5 mt-4 flex justify-between items-center border-t border-[#d5cfc2] min-h-[8vh]">
          <span className="font-bold text-xl sm:text-2xl text-[#165a4a]">
            총: {totalAmount.toLocaleString()}원
          </span>
          <button
            disabled={cart.length === 0}
            onClick={() => setShowTakeoutModal(true)}
            className={`px-6 py-2 rounded-xl font-bold transition text-white text-base sm:text-lg shadow ${
              cart.length === 0
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-[#165a4a] hover:bg-[#104036]'
            }`}
          >
            결제하기
          </button>
        </div>
      </div>

      {/* 모달: 포장 여부 */}
      {showTakeoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f0eade] p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4 text-[#333]">
              포장하시겠습니까?
            </h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-[#165a4a] text-white rounded hover:bg-[#104036]"
                onClick={() => {
                  setIsTakeout(true);
                  setShowTakeoutModal(false);
                  setShowRewardModal(true);
                }}
              >
                예
              </button>
              <button
                className="px-4 py-2 bg-[#d5cfc2] text-[#333] rounded hover:bg-[#c6beb1]"
                onClick={() => {
                  setIsTakeout(false);
                  setShowTakeoutModal(false);
                  setShowRewardModal(true);
                }}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 적립 여부 */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f0eade] p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4 text-[#333]">
              적립 여부를 선택해주세요
            </h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-[#165a4a] text-white rounded hover:bg-[#104036]"
                onClick={() => {
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
              <button
                className="px-4 py-2 bg-[#d5cfc2] text-[#333] rounded hover:bg-[#c6beb1]"
                onClick={() => {
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
