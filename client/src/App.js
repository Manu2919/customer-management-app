import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import AddressFormPage from './pages/AddressFormPage';
import './App.css';

function App() {
  return (
    <Router>
        <div className="App">
          <Routes>
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/customers/:customerId/add-address" element={<AddressFormPage />} />
            <Route path="/addresses/edit/:addressId" element={<AddressFormPage />} />
            <Route path="/" element={<CustomerListPage />} />
          </Routes>
        </div>
    </Router>
    
  );
}

export default App;
