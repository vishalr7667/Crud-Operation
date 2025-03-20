import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useFetch from '../utils/UseFetch';
import { useForm, FieldValues } from 'react-hook-form';
import Input from '../components/Input';
import Label from '../components/Label';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Product } from './DataTable';

const EditProduct : React.FC = () => {
    useEffect(() => {
        document.title = 'Edit Product';
      }, []);
    const [product, setProduct] = useState<any>({
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
        image: ''
    });
    const { id } = useParams();
    
    const { data, loading, error } = useFetch<Product>(`http://localhost:8000/api/v1/products/${id}`);
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();

    useEffect(() => {
        if (data && data) {
            setProduct(data);
            setValue('name', data.name);
            setValue('price', data.price);
            setValue('description', data.description);
            setValue('category', data.category);
            setValue('stock', data.stock)
        }
    }, [data])

    console.log("data",data);
    
    console.log("product",product);
    

    const navigate = useNavigate();
    const onSubmit = async (data: FieldValues) => {
        console.log(data);
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('stock', data.stock);
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }
        
        try {
            const response = await axios.put(`http://localhost:8000/api/v1/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true 
            })
            
            if (response.status === 200) {
                toast.success('Product updated successfully')
                navigate('/products')
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    if (loading) {
        return <h1>...loading</h1>
    }
    
    if (error) {
        return <h1>Error: {error}</h1>
    }

    
    
    
  return (
    <>
        
         <div className="flex flex-col items-center justify-start mt-15">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Add Product</h1>
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-2'>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" 
                        value={product.name} 
                        placeholder='Enter Product Name' 
                        
                        {...register('name',
                            {
                                required:"Product Name is required",
                                onChange: (e) => setProduct((prev: {}) => ({...prev, name: e.target.value}))
                            },  
                        )} />
                    </div>
                    {errors.name && <p className='text-red-500'>{errors.name.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" id="price"  value={product.price} placeholder='Enter Product Price' {...register('price',
                            {
                                required:"Product Price is required",
                                onChange: (e) => setProduct((prev: {}) => ({...prev, price: e.target.value}))
                            })} />
                    </div>
                    {errors.price && <p className='text-red-500'>{errors.price.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="description">Description</Label>
                        <Input type="text" id="description" value={product.description} placeholder='Enter Product Description' {...register('description',
                        {
                            required:"Product Description is required",
                            onChange: (e) => setProduct((prev: {}) => ({...prev, description: e.target.value}))
                        })} />
                    </div>
                    {errors.description && <p className='text-red-500'>{errors.description.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="image">Image</Label>
                        <Input type="file" id="image" {...register('image')} />
                        <img src={product.image} alt="product" className='w-10 h-10' />
                    </div>
                    {errors.image && <p className='text-red-500'>{errors.image.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="category">Category</Label>
                        <Input type="text" id="category" value={product.category} placeholder='Enter Product Category' {...register('category',
                            {
                                required:"Product Category is required",
                                onChange: (e) => setProduct((prev: {}) => ({...prev, category: e.target.value}))
                            }
                            )} />
                    </div>
                    {errors.category && <p className='text-red-500'>{errors.category.message?.toString()}</p>}
                    <div className='space-y-2'>
                        <Label htmlFor="stock">Stock</Label>
                        <Input type="number" id="stock" value={product.stock} placeholder='Enter Product Stock' {...register('stock',
                        {
                            required:"Product Stock is required",
                            onChange: (e) => setProduct((prev: {}) => ({...prev, stock: e.target.value}))
                        })} />
                    </div>
                    {errors.name && <p className='text-red-500'>{errors.name.message?.toString()}</p>}
                    <button type="submit" className='w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'>Update Product</button>
                </form>
            </div>
        </div>
        
    </>
  )
}

export default EditProduct 