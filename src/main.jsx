import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Category from './pages/Category';
import ProductByCategory from './pages/ProductsByCategory';
import Product from './pages/Product';
import Checkkout from './pages/payment/Checkout.jsx';
import Success from './pages/payment/Success.jsx';
import CompletePage from './pages/payment/Complete.jsx';
import App from './App.jsx';
import FirstScreen from './pages/main/FirstScreen.jsx';
import './index.css';
import Main from './pages/main/Main.jsx';
import PhoneInput from './pages/user/PhoneInput.jsx';
import UserInfo from './pages/user/UserInfo.jsx';
import Admin from './pages/admin/Admin.jsx';
import { FaI } from 'react-icons/fa6';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
const router = createBrowserRouter([
  {
    // 카테고리 밑에 카테고리 상품들 그리고 장바구니 이렇게 세개 뿌리고 나머지는 독립된 페이지로
    // context API로 상태 공유하도록 하기.
    // 디자인은 나중에 하고 직접 만들면서 연습하기...
    // firstpage
    // main은 카테고리리스트 상품리스트, 장바구니고 리스트 조회는 쿼리파라미터로 개별 페이지 만들어서 리턴하도록 한다.
    // children [ 상품리스트]
    path: '/',
    element: <App />,
    children: [
      {
        //
        path: 'category',
        element: <Category />,
      },
      {
        path: 'productsInCategory',
        element: <ProductByCategory />,
      },
      {
        path: 'product',
        element: <Product />,
      },
    ],
  },
  {
    path: '/firstScreen',
    element: <FirstScreen />,
  },

  {
    path: '/main',
    element: <Main />,
    children: [],
  },
  {
    path: '/checkout',
    element: <Checkkout />,
  },

  {
    path: '/success',
    element: <Success />,
  },
  {
    path: '/fail',
    element: <FaI />,
  },
  {
    path: '/payment/complete',
    element: <CompletePage />,
  },

  {
    path: '/phone',
    element: <PhoneInput />,
  },
  {
    path: '/userinfo',
    element: <UserInfo />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/admin/products',
    element: <AdminProducts />,
  },
  {
    path: '/admin/orders',
    element: <AdminOrders />,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
);
