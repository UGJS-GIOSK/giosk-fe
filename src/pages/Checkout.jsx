import { useEffect, useRef } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
// import { ANONYMOUS } from "@tosspayments/payment-widget-sdk"
import { nanoid } from 'nanoid';
import axios from 'axios';

const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'oQEAJA0-9FoX7pHI2g6vB';

import '../App.css';
import { useLocation } from 'react-router-dom';

export default function Checkout() {
  const paymentWidgetRef = useRef(null);
  const location = useLocation();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  // 위젯 미리 가져옴.
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

  // 위젯 로딩
  const handlePayment = async () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const paymentWidget = paymentWidgetRef.current;

    // 검증에 필요한 데이터 미리 보놰기
    const orderId = nanoid();
    const amount = totalPrice;

    const prevCheckoutInfo = {
      orderId,
      amount,
    };

    axios
      .post('http://localhost:8080/payment/temp', prevCheckoutInfo)
      .then(res => {
        console.log('서버 응답:', res.data);
      })
      .catch(err => {
        console.error('서버 에러:', err);
      });

    // 결제하기
    try {
      console.log(cart);
      await paymentWidget?.requestPayment({
        orderId: orderId,
        orderName:
          cart.length > 1
            ? `${cart[0].name} 외 ${cart.length - 1}건`
            : cart[0].name,
        customerName: '김진규',
        customerEmail: 'km1031kim@gmail.com',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <h1>주문서</h1>
      <div id="payment-widget" />
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}
