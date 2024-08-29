import { useEffect, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Tooltip from 'bootstrap/js/src/tooltip';
import { isWebView } from './utils/detectWebView'; // Import the utility function

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.jsx');
const meta = import.meta.glob('./pages/*.meta.js', { eager: true });

// Import your custom 404 component
const NotFound = lazy(() => import('./components/NotFound'));

// Generate routes dynamically
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
    // Tooltip initialization
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));

    // Clean up tooltips on component unmount
    return () => {
      tooltipList.map((t) => t.dispose());
    };
  }, []);

  useEffect(() => {
    // Redirection logic for WebView detection
    const isMainAddress = window.location.hostname === 'mailum.com' && window.location.pathname === '/';
    if (isMainAddress && isWebView()) {
      // Perform the redirection logic only on the main address
      window.location.href = '/mailbox/#login'; 
    }
  }, []);

  return (
    <>
      <Routes>
        {routes.map(({ path, component: RouteComp }) => (
          <Route key={path} path={path} element={<RouteComp />} />
        ))}

        {/* Catch-all route for 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
