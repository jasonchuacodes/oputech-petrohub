import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useManifest = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const manifest = pathname.startsWith('/admin')
      ? '/admin-manifest.json'
      : '/manifest.json';

    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');

    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }

    link.href = manifest;
  }, [pathname]);
};
