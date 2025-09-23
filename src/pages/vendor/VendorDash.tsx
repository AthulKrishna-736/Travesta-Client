import VendorLayout from '@/components/layouts/VendorLayout';
import { Outlet } from 'react-router-dom';

const VendorDashboard = () => {
    return (
        <VendorLayout title='Dashboard'>
            <>
                <Outlet />
            </>
        </VendorLayout >
    );
};

export default VendorDashboard;
