import { useNavigate } from 'react-router-dom';

export default function Fail() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>결제 실패</h1>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
}
