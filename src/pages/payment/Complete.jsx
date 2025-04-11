import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CompletePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [count, setCount] = useState(5); // 5초부터 시작

  useEffect(() => {
    if (!state) return;

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          clearInterval(interval);
          navigate('/firstScreen');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, state]);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#f0eade] flex flex-col items-center justify-center text-center font-['Pretendard'] px-4">
        <h2 className="text-3xl font-bold text-[#ba1b1d] mb-6">
          잘못된 접근입니다.
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#165a4a] text-white text-lg font-bold rounded-xl hover:bg-[#104036] transition"
        >
          홈으로
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0eade] flex flex-col items-center justify-center text-center font-['Pretendard'] px-4">
      <h1 className="text-5xl font-extrabold text-[#165a4a] mb-6">결제 완료</h1>
      <p className="text-2xl text-[#333333] mb-2 font-semibold">감사합니다!</p>
      <p className="text-lg text-[#555555] mb-10">
        {count}초 후 메인 화면으로 이동합니다.
      </p>
      <button
        onClick={() => navigate('/firstScreen')}
        className="px-6 py-3 bg-[#165a4a] text-white text-lg font-bold rounded-xl hover:bg-[#104036] transition"
      >
        홈으로 바로 가기
      </button>
    </div>
  );
}
