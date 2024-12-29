import React from 'react';

import Layout from '../../layout';

const Home: React.FC = () => {
    return (
        <Layout
            page={{
                name: 'home',
                title: 'Accueil',
            }}
        >
            <>Bienvenue sur Catoffice</>
        </Layout>
    );
};

export default Home;
