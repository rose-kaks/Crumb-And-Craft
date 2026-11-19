
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import CakeMenuPage from './pages/CakeMenuPage';
import CakeCustomizerPage from './pages/CakeCustomizerPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar cartCount={0} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<CakeMenuPage />} />
        <Route path="/cakes/:id" element={<CakeCustomizerPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
