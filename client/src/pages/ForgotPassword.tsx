import React, {useState} from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ForgotPassword : React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const onSubmit = async(data: FieldValues) => {  
        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/forgot-password', data, {
                withCredentials: true
            })
            console.log(response)
            if (response.status === 200) {
                toast.success('Password reset email sent')
                setIsLoading(false)
                navigate('/login')
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
            setIsLoading(false)
        }
    }

  return (
    <>
        <div className="flex flex-col items-center justify-start mt-15">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" {...register('email', { required: true})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}
                    <button type="submit"
                     disabled={isLoading}
                     className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                     >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button> 
                </form>
            </div>
        </div>
    </>
  )
}

export default ForgotPassword