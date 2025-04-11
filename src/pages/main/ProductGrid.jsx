import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ProductGrid({ category, onSelectProduct }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;
    axios
      .get(
        `http://localhost:8080/api/v1/products/category?category=${category}`,
      )
      .then(res => {
        console.log('📦 API 응답 내용:', res.data.data.content);
        setProducts(res.data.data.content);
      })
      .catch(err => console.error('상품 목록 조회 실패', err));
  }, [category]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {products.map(product => {
        const isSoldOut = product.status === 'OUT_OF_STOCK';

        return (
          <div
            key={product.product_id}
            onClick={() => {
              if (!isSoldOut) onSelectProduct(product.product_id);
            }}
            className={`bg-white rounded-xl shadow p-4 transition ${
              isSoldOut
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-105'
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price.toLocaleString()}원</p>
            {isSoldOut && (
              <p className="text-red-500 font-bold mt-1 text-sm">품절</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
