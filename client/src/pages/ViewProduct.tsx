import React, { useEffect, useState } from 'react'
import useFetch from '../utils/UseFetch';
import { Link, useParams } from 'react-router-dom';

const ViewProduct:React.FC = () => {
	useEffect(() => {
		document.title = 'View Product';
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
    
    const { data, loading, error } = useFetch<{}>(`http://localhost:8000/api/v1/products/${id}`);

	useEffect(() => {
		if (data) {
			setProduct(data);
		}
	}, [data])

	if (loading) {
		return <div>Loading...</div>	
	}
	if (error) {
		return <div>Error: {error}</div>
	}

  return (
	<div className='w-full h-full flex justify-center items-center p-10'>
		<title>View Products</title>
		<div className='w-1/2 border border-2 rounded-2xl border-gray-300 pb-5 shadow-2xl shadow-gray-500'>
			<img src={product.image} className='w-50 h-50 mx-auto rounded-full mt-2'/>
	  		{product.name && <h1 className='text-2xl text-center capitalize font-bold mt-2'>{product.name}</h1>}

			<div className='flex justify-between items-center p-4'>
				<div className='bg-gray-300 shadow-lg mt-4 shadow-gray-400 p-4 rounded-2xl'>
					<p className='text-lg font-semibold mt-2'>Price: ${product.price}</p>	
					<p className='text-lg font-semibold mt-2'>Category: {product.category}</p>
					
				</div>
				<div className='bg-gray-300 shadow-lg mt-4 shadow-gray-400 p-4 rounded-2xl'>
					<p className='text-lg font-semibold mt-2'>Stock: {product.stock}</p>
					<p className='text-lg font-semibold mt-2'>Description: {product.description}</p>
				</div>	
			</div>
			<div className='flex justify-between items-center p-4'>
				<Link to={`/products/${id}/edit`} className='bg-blue-500 text-white p-2 px-5 rounded-lg shadow-lg hover:bg-blue-700'>Edit</Link>
				<Link to='/products' className='bg-red-500 float-right text-white p-2 px-5 rounded-lg shadow-lg hover:bg-red-700'>Back</Link>
			</div>
	  	</div>
	</div>
  )
}

export default ViewProduct
