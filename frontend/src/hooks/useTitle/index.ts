import { useEffect } from 'react';

const useTitle = (title: string) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - Catoffice app`;
        }
    }, [title]);
};

export default useTitle;
