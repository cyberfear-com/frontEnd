import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import './index.scss'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <HashRouter>
    <App />
  </HashRouter>,
)
console.log('hydrated')