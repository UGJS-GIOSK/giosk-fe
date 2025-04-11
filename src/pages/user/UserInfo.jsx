import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, phoneNumber, isTakeout } = location.state;
  const [user, setUser] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    axios
      .post(
        'http://localhost:8080/api/v1/members',
        { phoneNumber },
        { withCredentials: true },
      )
      .then(res => {
        setUser(res.data.data);
      })
      .catch(err => console.error('사용자 정보 불러오기 실패', err));
  }, [phoneNumber]);

  const proceedToCheckout = (useCoupon = false) => {
    const reward = useCoupon === true ? false : true;

    console.log('📦 결제 정보 전송');
    console.log('🧑 userId:', user.memberId);
    console.log('📞 phoneNumber:', phoneNumber);
    console.log('🛍️ 포장 여부 (isTakeout):', isTakeout);
    console.log('🎁 적립 여부 (stamp):', reward);
    console.log('🏷️ 쿠폰 사용 여부 (coupon):', useCoupon);
    console.log('🛒 장바구니(cart):', cart);

    navigate('/checkout', {
      state: {
        cart,
        phoneNumber,
        userId: user.memberId,
        coupon: useCoupon,
        takeout: isTakeout,
        stamp: reward,
      },
    });
  };

  if (!user) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#f3efe5] flex flex-col items-center justify-center px-4 py-10 relative">
      <h2 className="text-2xl font-bold mb-6">회원 정보</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-3">
        <p>
          <strong>스탬프 수:</strong> {user.stamp}개
        </p>
        <p>
          <strong>쿠폰 수:</strong> {user.coupon}장
        </p>
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <button
          className="bg-[#165a4a] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#104036] transition"
          onClick={() => {
            if (user.coupon > 0) {
              setShowCouponModal(true);
            } else {
              proceedToCheckout(false);
            }
          }}
        >
          결제하기
        </button>

        <button
          className="bg-gray-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-500 transition"
          onClick={() => navigate('/main')}
        >
          취소하기
        </button>
      </div>

      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">쿠폰을 사용하시겠습니까?</h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  setShowCouponModal(false);
                  proceedToCheckout(true); // ✅ 쿠폰 사용
                }}
              >
                예
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setShowCouponModal(false);
                  proceedToCheckout(false); // ✅ 쿠폰 미사용
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
