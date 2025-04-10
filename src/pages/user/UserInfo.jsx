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
        if (res.data.data.coupon > 0) {
          setShowCouponModal(true);
        }
      })
      .catch(err => console.error('사용자 정보 불러오기 실패', err));
  }, [phoneNumber]);

  const proceedToCheckout = (useCoupon = false) => {
    const reward = true; // ✅ 이 페이지에 왔다는 건 적립하겠다고 한 상태니까

    console.log('📦 결제 정보 전송');
    console.log('🧑 userId:', user.memberId);
    console.log('📞 phoneNumber:', phoneNumber);
    console.log('🛍️ 포장 여부 (isTakeout):', isTakeout);
    console.log('🎁 적립 여부 (reward):', reward);
    console.log('🏷️ 쿠폰 사용 여부 (useCoupon):', useCoupon);
    console.log('🛒 장바구니(cart):', cart);

    navigate('/checkout', {
      state: {
        cart,
        phoneNumber,
        userId: user.memberId,
        useCoupon,
        isTakeout,
        reward,
      },
    });
  };

  if (!user) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#f3efe5] flex flex-col items-center justify-center px-4 py-10 relative">
      <h2 className="text-2xl font-bold mb-6">👤 사용자 정보</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-3">
        <p>
          <strong>ID:</strong> {user.memberId}
        </p>
        <p>
          <strong>전화번호:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>스탬프 수:</strong> {user.stamp}개
        </p>
        <p>
          <strong>쿠폰 수:</strong> {user.coupon}장
        </p>
      </div>

      {/* ✅ 결제 계속 & 취소 버튼 정렬 */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800"
          onClick={() => proceedToCheckout(false)}
        >
          결제하기
        </button>

        <button
          className="bg-gray-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-500"
          onClick={() => navigate('/main')}
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
