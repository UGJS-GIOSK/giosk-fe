import { useNavigate } from 'react-router-dom';
import logo from '../../assets/gioskLogo.webp';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function FirstScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/admin/login',
        { password },
        { withCredentials: true },
      );

      // 백엔드 응답 코드 기준 검사
      if (res.data.statusCode === 200) {
        navigate('/admin');
      } else {
        setError(res.data.message || '로그인 실패');
      }
    } catch (err) {
      // 네트워크 오류나 서버 에러 (500 등)
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0eade] flex flex-col items-center justify-center px-4 relative font-['Pretendard']">
      {/* 설정 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-4 right-4 text-[#e2dccc] hover:text-[#cfc6b3] transition"
      >
        <Settings size={22} strokeWidth={2} />
      </button>

      {/* 로고 & 주문하기 버튼 */}
      <img
        src={logo}
        alt="기오스크 로고"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mb-10"
      />
      <button
        onClick={() => navigate('/main')}
        className="bg-[#165a4a] text-white text-xl sm:text-2xl font-bold py-4 px-10 sm:px-16 rounded-full shadow-lg hover:bg-[#0f3f34] transition"
      >
        주문하기
      </button>

      {/* 설정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4 text-[#165a4a]">
              비밀번호를 입력하세요
            </h2>
            <input
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring focus:ring-[#165a4a]/50"
              placeholder="비밀번호"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-[#165a4a] text-white rounded hover:bg-[#104036]"
              >
                확인
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setPassword('');
                  setError('');
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
