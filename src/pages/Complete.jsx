import { useLocation, useNavigate } from 'react-router-dom';

export default function CompletePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    // 새로고침으로 직접 접근한 경우
    return (
      <div>
        <h2>잘못된 접근입니다.</h2>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    );
  }

  const { orderId, amount } = state;

  return (
    <div>
      <h1>결제 완료</h1>
      <p>주문 아이디: {orderId}</p>
      <p>결제 금액: {Number(amount).toLocaleString()}원</p>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
}
