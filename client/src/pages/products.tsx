import React, { useEffect } from 'react';
import useFetch from '../utils/UseFetch';
import { Link } from 'react-router-dom';
import DataTable, { Product } from './DataTable'; // Import DataTable & Product type

const Products: React.FC = () => {
    useEffect(() => {
        document.title = 'Products';
      }, []);
    // Fetch data from API
    const { data, loading, error } = useFetch<Product[]>('http://localhost:8000/api/v1/products/view-products');

    console.log("API Response Data:", data);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
        <title>Products</title>
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold ">Products</h1>

            <Link className="bg-blue-500 inline-block text-white px-4 py-2 float-end rounded-md" to="/add-product">
                Add Product
            </Link>

            {/* DataTable Component */}
            <div className="mt-15">
                <DataTable data={data || []} />
            </div>
        </div>
        </>
    );
};

export default Products;
