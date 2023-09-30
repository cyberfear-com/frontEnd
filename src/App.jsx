import { useEffect, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import Tooltip from 'bootstrap/js/src/tooltip'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.jsx')
const meta = import.meta.glob('./pages/*.meta.js', { eager: true })

//console.log('meta', meta)
const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1]
  const metaName = `./pages/${name}.meta.js`
 // console.log('mm', metaName, meta[metaName])
  const nameDashed = name.replace(/[^A-Z][A-Z]/g, m => m[0] + "-" + m[1]).toLowerCase()

  const component = lazy(pages[path])
  return {
    name,
    path: meta[metaName]?.default.path || (name === 'Home' ? '/' : `/${nameDashed}`),
    component,
  }
})

export function App() {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
    return () => {
        tooltipList.map(t => t.dispose())
    }
  }, [])

  return (
    <>
      <Routes>
        {routes.map(({ path, component: RouteComp }) => {
          return <Route key={path} path={path} element={<RouteComp />}></Route>
        })}
      </Routes>
    </>
  )
}
