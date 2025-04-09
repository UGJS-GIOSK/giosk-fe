// src/pages/FirstScreen.jsx

import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png'; // 이미지 경로 확인 필요

export default function FirstScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3eee8] flex flex-col justify-between items-center p-6">
      <div className="flex-grow flex items-center justify-center">
        <img src={logo} alt="기오스크 로고" className="w-48 h-auto" />
      </div>
      <button
        onClick={() => navigate('/product')}
        className="w-full text-white bg-[#165a4a] hover:bg-[#0f3f34] text-2xl font-bold py-6 rounded-xl"
      >
        주문하기
      </button>
    </div>
  );
}
