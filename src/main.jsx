import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ApiTest from './ApiTest';
import Category from './pages/Category';
import ProductByCategory from './pages/ProductsByCategory';
import Product from './pages/Product';
import Checkkout from './pages/Checkout.jsx';
import Success from './pages/Success.jsx';
import Fail from './pages/Fail.jsx';
import CompletePage from './pages/Complete.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ApiTest />,
    children: [
      {
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
    path: '/checkout',
    element: <Checkkout />,
  },

  {
    path: '/success',
    element: <Success />,
  },
  {
    path: '/fail',
    element: <Fail />,
  },
  {
    path: '/payment/complete',
    element: <CompletePage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
);
