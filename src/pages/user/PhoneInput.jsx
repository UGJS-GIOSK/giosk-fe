import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PhoneInput() {
  const [digits, setDigits] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const cart = location.state?.cart || [];
  const isTakeout = location.state?.isTakeout;
  const reward = location.state?.reward;

  const handlePress = num => {
    if (digits.length < 8) setDigits(prev => prev + num);
  };

  const handleDelete = () => {
    setDigits(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const phoneNumber = `010${digits}`;
    navigate('/userinfo', {
      state: {
        cart,
        phoneNumber: phoneNumber,
        isTakeout, // ✅ 반드시 넘겨줘야 해
        reward, // ✅ 적립 여부도
      },
    });
  };

  const handleBack = () => {
    // 장바구니 비우면서 메인 페이지로 이동
    navigate('/main', { state: { cart: [...cart] } });
  };

  const renderPhone = () => {
    const first = digits.slice(0, 4).padEnd(4, '_');
    const second = digits.slice(4, 8).padEnd(4, '_');
    return `010 ${first} ${second}`;
  };

  return (
    <div className="min-h-screen bg-[#f3efe5] flex flex-col items-center justify-center px-4 py-8 relative">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-gray-600 text-lg font-bold"
      >
        ◀ 뒤로가기
      </button>

      <h2 className="text-2xl font-bold mb-6">전화번호를 입력해주세요</h2>

      <div className="text-3xl font-mono tracking-widest mb-8">
        {renderPhone()}
      </div>

      {/* 키패드 */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((val, idx) => (
          <button
            key={idx}
            onClick={
              val === '⌫'
                ? handleDelete
                : val === ''
                  ? undefined
                  : () => handlePress(val)
            }
            className={`w-20 h-20 rounded-full text-2xl font-semibold shadow ${
              val
                ? 'bg-white hover:bg-gray-100 active:scale-95'
                : 'bg-transparent pointer-events-none'
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={digits.length !== 8}
        className={`w-full max-w-xs py-3 rounded-xl font-bold text-lg transition ${
          digits.length === 8
            ? 'bg-green-700 text-white hover:bg-green-800'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
}
