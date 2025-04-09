import axios from 'axios';
import { useState } from 'react';

function Category() {
  // 여기에 axios 하면 된다.
  const [categories, setCategories] = useState([]);

  const getAllCategories = () => {
    axios.get('http://localhost:8080/categories').then(res => {
      console.log(res.data);
      setCategories(res.data.data.content);
    });
  };

  return (
    <>
      <h2>전체 카테고리 조회 API</h2>
      <button onClick={getAllCategories}>API 호출</button>
      {categories.map((category, index) => (
        <li key={index}>{category}</li>
      ))}
    </>
  );
}

export default Category;
