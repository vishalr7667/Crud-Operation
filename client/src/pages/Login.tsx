import Label from '../components/Label'
import React, { useContext } from 'react'
import Input from '../components/Input'
import { useForm, FieldValues } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

const Login : React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    if (!authContext) {
        return null
    }

    const { setAuth } = authContext

    const onSubmit = async(data: FieldValues) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login', data,{
                withCredentials: true
            })
            console.log(response)
            if (response.status === 201) {
                toast.success('Login successful')
                setAuth(response.data?.data);
                localStorage.setItem('user', JSON.stringify(response.data?.data))
                navigate('/')
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }
  return (
    <>
        <div className="flex flex-col items-center justify-start mt-15">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" id="email" {...register('email', {
                            required: 'Email is required',
                        })} placeholder="Enter your email || Username" />
                    </div>
                    {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" {...register('password', {
                            required: 'Password is required',
                        })} placeholder="Enter your password" />
                    </div>
                    {errors.password && <p className="text-red-500">{errors.password.message?.toString()}</p>}
                    <div className="flex justify-between text-sm/5 text-gray-700">
                        <Link to="/forgot-password">Forgot Password?</Link>
                        <Link to="/register">Don't have an account?</Link>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Login</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login