import { useEffect, lazy, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Tooltip from 'bootstrap/js/src/tooltip';
import { isWebView } from './utils/detectWebView';
import CustomAlert from './components/CustomAlert'; // Import the CustomAlert component

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
  const [alertVisible, setAlertVisible] = useState(false); // State to control the visibility of the alert
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message

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
      setAlertMessage('You are accessing this site from a WebView! Redirecting...');
      setAlertVisible(true); // Show alert
      setTimeout(() => {
        window.location.href = 'https://mailum.com/mailbox/#login';
      }, 3000); // Delay before redirection (3 seconds)
    }
  }, []);

  const handleCloseAlert = () => {
    setAlertVisible(false); // Hide alert when close button is clicked
  };

  return (
    <>
      {alertVisible && <CustomAlert message={alertMessage} onClose={handleCloseAlert} />} {/* Render the alert if visible */}
      
      <Routes>
        {routes.map(({ path, component: RouteComp }) => (
          <Route key={path} path={path} element={<RouteComp />} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
