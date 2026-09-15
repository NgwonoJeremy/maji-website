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
import ProtectedRoute from "./Components/ProtectedRoute";
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path ="/customer" element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard/>
            </ProtectedRoute>
          }/>

          <Route path ="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard/>
            </ProtectedRoute>
          }/>

          <Route path="/orders" element={<AllOrders />} />
          <Route path="/vendors" element={<AllVendors />} />
          <Route path="/vendor/register" element={<VendorRegister />} />

          <Route path ="/vendor/dashboard" element={
            <ProtectedRoute allowedRole="vendor">
              <VendorDashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;