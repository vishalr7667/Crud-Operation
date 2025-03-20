import React from 'react'
import Label from '../components/Label'
import Input from '../components/Input'
import { useForm, FieldValues } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AddProduct: React.FC = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async (data: FieldValues) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('price', data.price)
        formData.append('description', data.description)
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0])
        }
        formData.append('category', data.category)
        formData.append('stock', data.stock)

        try {
            const response = await axios.post('http://localhost:8000/api/v1/products/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            console.log(response)
            toast.success('Product added successfully')
            navigate('/products')
        } catch (error: any) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }
  return (
    <div>
         <div className="flex flex-col items-center justify-start mt-15">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Add Product</h1>
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-2'>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" placeholder='Enter Product Name' {...register('name',{required:true})} />
                    </div>
                    {errors.name && <p className='text-red-500'>{errors.name.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" id="price" placeholder='Enter Product Price' {...register('price',{required:true})} />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="description">Description</Label>
                        <Input type="text" id="description" placeholder='Enter Product Description' {...register('description',{required:true})} />
                    </div>
                    {errors.description && <p className='text-red-500'>{errors.description.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="image">Image</Label>
                        <Input type="file" id="image" {...register('image',{required:true})} />
                    </div>
                    {errors.image && <p className='text-red-500'>{errors.image.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="category">Category</Label>
                        <Input type="text" id="category" placeholder='Enter Product Category' {...register('category',{required:true})} />
                    </div>
                    {errors.category && <p className='text-red-500'>{errors.category.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="stock">Stock</Label>
                        <Input type="number" id="stock" placeholder='Enter Product Stock' {...register('stock',{required:true})} />
                    </div>
                    {errors.name && <p className='text-red-500'>{errors.name.message?.toString()}</p>}
                    <button type="submit" className='w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'>Add Product</button>
                </form>
            </div>
        </div>
        
    </div>
  )
}

export default AddProduct