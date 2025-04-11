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
    takeout,
    coupon,
    stamp,
  } = location.state || {};

  // 💰 쿠폰 사용 시 2000원 할인
  const rawPrice = cart.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0,
  );
  const discount = coupon ? 2000 : 0;
  const totalPrice = Math.max(rawPrice - discount, 0);

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

  const handlePayment = async () => {
    const orderId = nanoid();

    // ✅ localStorage 저장
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('userId', userId ?? null);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('takeout', takeout);
    localStorage.setItem('coupon', coupon);
    localStorage.setItem('stamp', stamp);

    // ✅ 로그 출력
    console.log('💳 결제 요청 정보');
    console.log('🧾 주문번호(orderId):', orderId);
    console.log('🧑 사용자 ID:', userId);
    console.log('📞 전화번호:', phoneNumber);
    console.log('📦 포장 여부:', takeout);
    console.log('🎁 적립 여부:', stamp);
    console.log('🏷️ 쿠폰 사용 여부:', coupon);
    console.log('🛒 장바구니:', cart);
    console.log('💰 총 금액:', rawPrice);
    console.log('➖ 할인:', discount);
    console.log('✅ 최종 결제 금액:', totalPrice);

    // ✅ 백엔드 임시 저장
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

    // ✅ 결제 위젯 실행
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
      <h1 className="text-3xl font-bold mb-6"> 주문서</h1>

      <div className="text-sm mb-2 text-gray-600">
        {coupon && <p>💸 쿠폰 할인 적용: -2,000원</p>}
      </div>

      <div className="text-xl font-bold mb-4">
        총 결제 금액: {totalPrice.toLocaleString()}원
      </div>

      <div id="payment-widget" className="w-full max-w-md mb-6" />

      <button
        onClick={handlePayment}
        className="w-full max-w-md py-4 text-xl font-bold bg-[#165a4a] text-white rounded-xl hover:bg-[#104036] transition"
      >
        결제하기
      </button>
    </div>
  );
}
