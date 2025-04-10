import { useEffect, useRef } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'oQEAJA0-9FoX7pHI2g6vB';

export default function Checkout() {
  const paymentWidgetRef = useRef(null);
  const location = useLocation();

  const {
    cart = [],
    userId,
    phoneNumber,
    isTakeout,
    useCoupon,
    reward,
  } = location.state || {};

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0,
  );

  // Toss 위젯 불러오기
  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        widgetClientKey,
        customerKey,
      );
      paymentWidget.renderPaymentMethods('#payment-widget', totalPrice);
      paymentWidgetRef.current = paymentWidget;
    })();
  }, [totalPrice]);
  localStorage.setItem('userId', userId ?? null);

  const handlePayment = async () => {
    const orderId = nanoid();

    // ✅ 여기 추가!
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('userId', userId ?? null);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('isTakeout', isTakeout);
    localStorage.setItem('useCoupon', useCoupon);
    localStorage.setItem('reward', reward);
    localStorage.setItem('userId', userId ?? null);

    // 1️⃣ 콘솔 출력
    console.log('💳 결제 요청 정보');
    console.log('🧾 주문번호(orderId):', orderId);
    console.log('🧑 사용자 ID:', userId);
    console.log('📞 전화번호:', phoneNumber);
    console.log('📦 포장 여부:', isTakeout);
    console.log('🎁 적립 여부:', reward);
    console.log('🏷️ 쿠폰 사용 여부:', useCoupon);
    console.log('🛒 장바구니:', cart);
    console.log('💰 결제 금액:', totalPrice);

    // 2️⃣ 백엔드에 결제 금액만 임시 저장
    try {
      await axios.post(
        'http://localhost:8080/api/v1/payments/temp',
        { orderId, amount: totalPrice },
        { withCredentials: true },
      );
      console.log('✅ 금액 임시 저장 성공');
    } catch (err) {
      console.error('❌ 임시 저장 실패:', err);
    }

    // 3️⃣ Toss 결제 요청
    try {
      await paymentWidgetRef.current?.requestPayment({
        orderId,
        orderName:
          cart.length > 1
            ? `${cart[0].name} 외 ${cart.length - 1}건`
            : cart[0].name,
        customerName: '박성근',
        customerEmail: 'opuzo1@gmail.com',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (err) {
      console.error('❌ 결제 요청 실패:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe5] flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">🧾 주문서</h1>

      <div id="payment-widget" className="w-full max-w-md mb-6" />

      <button
        onClick={handlePayment}
        className="w-full max-w-md py-4 text-xl font-bold bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
      >
        결제하기
      </button>
    </div>
  );
}
