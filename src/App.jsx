import { useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Tooltip from 'bootstrap/js/src/tooltip'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.jsx', { eager: true })

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1]
  const nameDashed = name.replace(/[A-Z]/g, m => "-" + m.toLowerCase()).slice(1)
  console.log(name, nameDashed)
  return {
    name,
    path: name === 'Home' ? '/' : `/${nameDashed}`,
    component: pages[path].default,
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