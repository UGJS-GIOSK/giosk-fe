// App.jsx
import { useNavigate } from 'react-router-dom';

export default function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Giosk</h1>
      <button
        className="px-8 py-4 text-xl font-semibold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
        onClick={() => navigate('/product')}
      >
        주문하기
      </button>
    </div>
  );
}
