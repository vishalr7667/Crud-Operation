import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/Auth'

export default function Logout () {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    if (!authContext) {
        return null
    }

    const { setAuth } = authContext;
    useEffect(() => {
        axios.post("http://localhost:8000/api/v1/users/logout",{}, {
            withCredentials: true
        })
        .then(() => {
            localStorage.removeItem('user')
            setAuth(null)            
            navigate('/login')
        }).catch((err) => {
            toast.error(`Failed to logout ${err}`)
        })
    }, [])

    return (
        <div className='flex justify-center items-center h-screen'>
            <h1>Logging out...</h1>
        </div>
    )
}
