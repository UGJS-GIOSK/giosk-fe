import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentType = searchParams.get('paymentType');
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    // localStorage에서 데이터 가져오기
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const userIdRaw = localStorage.getItem('userId');
    const userId =
      userIdRaw === 'null' || userIdRaw === 'undefined' ? null : userIdRaw;
    const takeout = localStorage.getItem('isTakeout') === 'true';
    const coupon = localStorage.getItem('useCoupon') === 'true';
    const stamp = localStorage.getItem('reward') === 'true';

    const payload = {
      paymentType,
      orderId,
      paymentKey,
      amount: Number(amount),
      memberId: userId,
      takeout,
      coupon,
      stamp,
      cart,
    };

    console.log('✅ 결제 성공. 백엔드로 전송할 payload:', payload);

    axios
      .post('http://localhost:8080/api/v1/payments/confirm', payload, {
        withCredentials: true,
      })
      .then(res => {
        console.log('✅ 결제 정보 저장 성공:', res.data);

        // 모든 임시 저장 데이터 삭제
        localStorage.removeItem('cart');
        localStorage.removeItem('userId');
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('isTakeout');
        localStorage.removeItem('useCoupon');
        localStorage.removeItem('reward');

        // 완료 페이지 이동
        navigate('/payment/complete', {
          state: { orderId, amount },
          replace: true,
        });
      })
      .catch(err => {
        console.error('❌ 결제 저장 실패:', err);
        navigate('/fail');
      });
  }, [searchParams, navigate]);

  return <p className="text-center mt-10 text-xl">결제 처리 중입니다...</p>;
}
