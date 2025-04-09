import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const navigate = useNavigate();

  useEffect(() => {
    const paymentType = searchParams.get('paymentType');
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    const payload = {
      paymentType,
      orderId,
      paymentKey,
      amount,
      cart,
    };

    // 백엔드로 POST 요청
    axios
      .post('http://localhost:8080/api/v1/payments/success', payload)
      .then(() => {
        localStorage.removeItem('cart');
        navigate('/payment/complete', {
          state: { orderId, amount },
          replace: true, // 히스토리에 남기지 않음 (뒤로가기 시 /success 못 감)
        });
      })
      .catch(err => {
        console.error('서버 에러:', err);
        navigate('/fail'); // 실패시 페이지
      });
  }, [searchParams, navigate, cart]);

  return <p>결제 처리 중입니다...</p>;
}
