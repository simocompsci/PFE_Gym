import { BrowserRouter , Route , Routes  } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import StatCards from './components/common/StatCards';
import OverviewPage from './Pages/OverviewPage';
import StaffPage from './Pages/StaffPage';
import ClientsPage from './Pages/ClientsPage';
import ProductsPage from './Pages/ProductsPage';
import ClassesPage from './Pages/ClassesPage';
import AnalyticsPage from './Pages/AnalyticsPage';
import './index.css'
import LoginPage from './Pages/LoginPage';


function App() {

  return (
    <div className='flex h-screen bg-gray-300 text-gray-800 overflow-hidden'>
      {/* BG */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute bg-white' />
        <div className='absolute inset-0' />
      </div>
    <BrowserRouter>
    <Sidebar />
      <Routes>
        <Route path='/' element={<OverviewPage />} />
        <Route path='/staff' element={<StaffPage />} />
        <Route path='/clients' element={<ClientsPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/classes' element={<ClassesPage />} />
        <Route path='/analytics' element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
      
    </div>
  )
}
export default App
