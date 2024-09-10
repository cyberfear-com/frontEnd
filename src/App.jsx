import { useEffect, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Tooltip from 'bootstrap/js/src/tooltip';
import { isWebView } from './utils/detectWebView'; // Import the utility function

const pages = import.meta.glob('./pages/*.jsx');
const meta = import.meta.glob('./pages/*.meta.js', { eager: true });
const NotFound = lazy(() => import('./components/NotFound'));

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1];
  const metaName = `./pages/${name}.meta.js`;
  const nameDashed = name.replace(/[^A-Z][A-Z]/g, (m) => m[0] + '-' + m[1]).toLowerCase();

  const component = lazy(pages[path]);
  return {
    name,
    path: meta[metaName]?.default.path || (name === 'Home' ? '/' : `/${nameDashed}`),
    component,
  };
});

export function App() {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));

    return () => {
      tooltipList.map((t) => t.dispose());
    };
  }, []);

  useEffect(() => {
    const isMainAddress = window.location.pathname === '/';

    if (isMainAddress && isWebView()) {
      //alert('You are accessing this site from a WebView! Redirecting...'); 
      window.location.href = '/mailbox/#login'; 
    }
  }, []);

  return (
    <>
      <Routes>
        {routes.map(({ path, component: RouteComp }) => (
          <Route key={path} path={path} element={<RouteComp />} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
