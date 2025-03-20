import React from 'react'
import Label from '../components/Label'
import Input from '../components/Input'
import { useForm, FieldValues } from 'react-hook-form'
import axios from 'axios'
import  { toast }  from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const onSubmit = async (data: FieldValues) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("userName", data.userName);
        formData.append("password", data.password);
        // `data.avatar` is an array, get the first file
        if (data.avatar && data.avatar[0]) {
            formData.append("avatar", data.avatar[0]); // Append the file correctly
        }

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData)
            console.log("response",response);
            
            if (response.status === 201) {
                toast.success('User registered successfully')
                navigate('/login')
            
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
       
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input type="text" id="fullName" {...register('fullName', {
                            required: 'Full Name is required',
                            minLength: {
                                value: 3,
                                message: 'Full Name must be at least 3 characters long'
                            }
                        })} placeholder="Enter your full name" />
                    </div>
                    {errors.fullName && <p className="text-red-500">{errors.fullName.message?.toString()}</p>}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })} placeholder="Enter your email" />
                    </div>
                    {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}

                    <div className="space-y-2">
                        <Label htmlFor="userName">Username</Label>
                        <Input type="text" id="userName" {...register('userName', {
                            required: 'Username is required',
                            minLength: {
                                value: 3,
                                message: 'Username must be at least 3 characters long'
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9]+$/,
                                message: 'Username should not contain any special characters'
                            }
                        })} placeholder="Enter your User Name" />
                    </div>
                    {errors.userName && <p className="text-red-500">{errors.userName.message?.toString()}</p>}

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar</Label>
                        <Input type="file" id="avatar" {...register('avatar', {
                            required: 'Avatar is required'
                        })}/>
                    </div>
                    {errors.avatar && <p className="text-red-500">{errors.avatar.message?.toString()}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long'
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                            }
                        })} placeholder="Enter your password" />
                    </div>
                    {errors.password && <p className="text-red-500">{errors.password.message?.toString()}</p>}
                    <div className="flex justify-end text-gray-700 text-sm">
                        <Link to="/login">Already have an account? Login</Link>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Register</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Register