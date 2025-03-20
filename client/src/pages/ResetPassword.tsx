import React, { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
const ResetPassword : React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true)
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/users/reset-password`, {token, ...data});
      console.log(response);
      toast.success('Password reset successfully')
      navigate('/login')
      setIsLoading(false)
    } catch (error: any) {
      console.log(error.response.data?.message);
      toast.error(error.response.data?.message);
      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col items-center justify-start mt-15">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" id="password" {...register('password', { required: true})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {errors.password && <p className="text-red-500">{errors.password.message?.toString()}</p>}
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" id="confirmPassword" {...register('confirmPassword', { required: true})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message?.toString()}</p>}
                    <button type="submit"
                     disabled={isLoading}
                     className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                     >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button> 
                </form>
            </div>
        </div>
  )
}

export default ResetPassword