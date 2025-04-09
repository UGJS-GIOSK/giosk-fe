import axios from 'axios';
import { useEffect, useState } from 'react';

function ProductByCategory() {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/categories').then(res => {
      const categoryList = res.data.data.content;
      setCategories(categoryList);
      setSelected(categoryList[0]);
    });
  }, []);

  const getProductsByCategory = () => {
    axios
      .get(`http://localhost:8080/products/category?category=${selected}`)
      .then(res => {
        setProduct(res.data.data.content);
      });
  };

  const handleChange = e => {
    setSelected(e.target.value);
  };

  return (
    <div>
      <h2>카테고리별 상품 목록 조회 API</h2>
      <label htmlFor="category">카테고리 선택 </label>
      <select id="category" value={selected} onChange={handleChange}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <button onClick={getProductsByCategory}> API 호출</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {product.map(p => (
          <li
            key={p.product_id}
            style={{
              marginBottom: '1rem',
              borderBottom: '1px solid #ddd',
              paddingBottom: '1rem',
            }}
          >
            <p>
              <strong>상품 ID:</strong> {p.product_id}
            </p>
            <p>
              <strong>이름:</strong> {p.name}
            </p>
            <p>
              <strong>가격:</strong> {p.price}
            </p>
            <p>
              <strong>이미지:</strong>
            </p>
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: '200px',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductByCategory;
