import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'
const DeleteProduct : React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id", id);
  useEffect(() => {
	const deleteProduct = async(): Promise<void> => {
		try {
			const response = await axios.delete(`http://localhost:8000/api/v1/products/${id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true
			});

			if (response.status === 200) {
				console.log("Product Deleted");
				toast.success('Product Deleted');
				navigate('/products');	
			}

		} catch (error) {
			toast.error('Failed to delete product');
			navigate('/products');
		}
	}
	
	deleteProduct();

  }, [id])
  return (
	<div>
		Deleting...
	</div>
  )
}

export default DeleteProduct
