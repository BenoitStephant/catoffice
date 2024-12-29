import React from 'react';

import Layout from '../../layout';

const Cat: React.FC = () => {
    return (
        <Layout
            page={{
                name: 'cat',
                title: 'Chats',
            }}
        >
            <>Chats</>
        </Layout>
    );
};

export default Cat;
