import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-xxxxxxxxxxxxxxxxx'; // под ID пользователя

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect (() => {
    // загрузка скрипта GoogleAnalytics
        if (!window.gtag) {
            const script = document.createElement('script');
            script.src = `https:// www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            script.async = true;
            document.head.appendChild(script);
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () {window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', GA_MEASUREMENT_ID);
        }
    }, []); 

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', GA_MEASUREMENT_ID, { page_path: location.pathname + location.search});
        }
    }, [location]);

    return null;    
};

export default GoogleAnalytics;