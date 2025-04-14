import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminProductList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/categories?page=${page}&size=5`,
        { withCredentials: true },
      );
      setCategories(res.data.data.content);
      setIsLastPage(res.data.data.last);
      if (res.data.data.content.length > 0) {
        setSelectedCategory(res.data.data.content[0]);
      }
    } catch (err) {
      console.error('카테고리 조회 실패:', err);
    }
  };

  const fetchProducts = async category => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/products/category?category=${category}`,
        { withCredentials: true },
      );
      setProducts(res.data.data.content);
    } catch (err) {
      console.error('상품 조회 실패:', err);
    }
  };

  const toggleStatus = async productId => {
    try {
      const url = `http://localhost:8080/api/v1/products/${productId}/status`;
      console.log('📡 상태 변경 요청:', {
        method: 'PATCH',
        url,
        data: {},
        config: { withCredentials: true },
      });

      await axios.patch(url, {}, { withCredentials: true });

      fetchProducts(selectedCategory);
    } catch (err) {
      console.error('❌ 상태 변경 실패:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f0eade] px-6 py-10 font-['Pretendard']">
      {/* 상단 - 제목 + 뒤로가기 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#165a4a]">상품 관리</h1>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-[#165a4a] text-white rounded-xl hover:bg-[#104036] font-bold"
        >
          뒤로가기
        </button>
      </div>

      {/* 카테고리 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
        >
          ◀
        </button>
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 font-bold px-4 py-2 rounded-full shadow whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={isLastPage}
          className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
        >
          ▶
        </button>
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.product_id}
            className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-[#165a4a] mb-2">
                {product.name}
              </h2>
              <p className="text-lg text-gray-700 mb-1">
                가격: {product.price.toLocaleString()}원
              </p>
              <p className="text-sm text-gray-600">
                상태:{' '}
                <span
                  className={`font-bold ${
                    product.status === 'OUT_OF_STOCK'
                      ? 'text-red-500'
                      : 'text-[#165a4a]'
                  }`}
                >
                  {product.status === 'OUT_OF_STOCK' ? '품절' : '판매중'}
                </span>
              </p>
            </div>
            <button
              onClick={() => toggleStatus(product.product_id)}
              className="mt-4 px-4 py-2 bg-[#165a4a] text-white rounded-lg hover:bg-[#104036] transition text-sm font-semibold"
            >
              상태 변경
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
