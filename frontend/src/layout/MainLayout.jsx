import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Loader from '../components/loader/Loader';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container-global">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
