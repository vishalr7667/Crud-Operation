'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/Auth'

export default function Header() {
  const authContext = useContext(AuthContext)
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { auth } = authContext;  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            <Link to="/products" className='-m-1.5 p-1.5'>
                <span className='text-gray-900 text-sm/6 font-semibold'>Products</span>
            </Link>
        </div>
          

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>  
        {!auth && (
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
                Log in 
            </Link>
            <Link to="/register" className='-m-1.5 ml-4 p-1.5'>
                <span className='text-gray-900 text-sm/6 font-semibold'>Register</span>
            </Link>
        </div>
        )}
        {auth && (
            <div className="relative">
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <img
                    src={auth.avatar}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full border border-gray-300"
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                        <li>
                            <Link
                                to="/logout"
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
        )}
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Products
                </Link>
                <Link
                  to="/register"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
