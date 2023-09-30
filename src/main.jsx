import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import { App } from './App'
import './index.scss'
import { Suspense } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
      <Suspense fallback={<div>Loading...</div>}>
    <App />
      </Suspense>
  </Router>,
)
