import React from 'react';

import Sidebar from '../components/ui/sidebar';
import useTitle from '../hooks/useTitle';

import './style.css';
import { Toaster } from '@chakra-ui/react';

interface LayoutProps {
    page: {
        name: string;
        title?: string;
        layout?: 'app' | 'plain';
    };
    children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ page, children }) => {
    return (
        <div className="screen" data-current-page={page.name} data-layout="app">
            <Sidebar />
            <div className="layout">
                <div className="topbar">
                    <span className="topbar__title">{page.title}</span>
                </div>
                <main className="main-content">
                    <div className="main-content__container">{children}</div>
                </main>
            </div>
        </div>
    );
};

const PlainLayout: React.FC<LayoutProps> = ({ page, children }) => {
    return (
        <div className="screen" data-current-page={page.name} data-layout="plain">
            <main className="main-content">
                <div className="main-content__container">{children}</div>
            </main>
        </div>
    );
};

const LayoutRenderer: React.FC<LayoutProps> = (props) => {
    const layout = props?.page?.layout || 'app';

    switch (layout) {
        case 'plain':
            return <PlainLayout {...props} />;
        case 'app':
        default:
            return <AppLayout {...props} />;
    }
};

const Layout: React.FC<LayoutProps> = (props) => {
    const { title } = props.page;

    useTitle(title || 'Catoffice app');

    return <LayoutRenderer {...props} />;
};

export default Layout;
