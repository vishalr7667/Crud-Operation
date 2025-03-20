import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = ({title} : {title: string}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <title>{title}</title> {/* ✅ Correct way in React 19 */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout