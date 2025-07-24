import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from '../AdminSideBar/AdminSideBar';

const LayoutAdmin = () => {
    return (
        <div style={{ display: 'flex' }}>
            <AdminSideBar />
            <div style={{ marginLeft: '280px', padding: '20px', flex: 1 }}>
                {/* 280px = chiều rộng Sidebar */}
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutAdmin;
