import 'leaflet/dist/leaflet.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import CustomerDashboard from "./Pages/customer/CustomerDashboard";
import AdminDashboard from './Pages/admin/Admin_dash';
import AllOrders from './Pages/admin/AllOrders';
import AllVendors from './Pages/admin/AllVendors';
import VendorRegister from './Pages/vendor/VendorRegister';
import VendorDashboard from './Pages/vendor/VendorDashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/orders" element={<AllOrders />} />
          <Route path="/vendors" element={<AllVendors />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;