import { Link } from 'react-router-dom';

function Header() {
  return (
    <ul>
      <li>
        <Link to="/category">카테고리 조회</Link>
      </li>
      <li>
        <Link to="/productsInCategory">카테고리별 상품 조회</Link>
      </li>
      <li>
        <Link to="/product">개별 상품 조회</Link>
      </li>
    </ul>
  );
}

export default Header;
