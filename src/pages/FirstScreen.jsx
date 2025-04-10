import { useNavigate } from 'react-router-dom';
import logo from '../assets/gioskLogo.webp';

export default function FirstScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kioskBg flex flex-col items-center justify-center px-4">
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
    </div>
  );
}
