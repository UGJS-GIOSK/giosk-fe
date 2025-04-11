import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0eade] flex flex-col items-center justify-center px-4 py-10 font-['Pretendard']">
      <h1 className="text-4xl font-extrabold text-[#165a4a] mb-12">
        관리자 페이지
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <button
          onClick={() => navigate('/admin/products')}
          className="w-full py-4 text-lg font-bold bg-[#165a4a] text-white rounded-xl hover:bg-[#104036] transition"
        >
          상품 관리
        </button>

        <button
          onClick={() => navigate('/admin/orders')}
          className="w-full py-4 text-lg font-bold bg-[#165a4a] text-white rounded-xl hover:bg-[#104036] transition"
        >
          주문 내역 확인
        </button>
      </div>

      <button
        onClick={() => navigate('/firstScreen')}
        className="mt-12 text-sm text-[#165a4a] underline hover:text-[#104036] transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
