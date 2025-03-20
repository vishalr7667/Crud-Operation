import axios from 'axios';
import { useState, useEffect } from 'react';

interface UseFetchProps {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: any;
    params?: any;
    body?: any;
}

const useFetch = <T>(url: string, options?: UseFetchProps) => {
    console.log("url", url);
    
    
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("url");
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const config = {
                    url,
                    method: options?.method || 'GET',
                    headers: options?.headers,
                    params: options?.params,
                    data: options?.body,
                    withCredentials: true
                }
                const response = await axios.request<{data?: {docs?: T}}>(config);

                const responseData = response?.data?.data?.docs ?? response.data?.data ?? null;
                setData(responseData as T | null);
                setLoading(false);
            } catch (error) {
                setError((error as any).message || "Something went wrong");
                setLoading(false);
            }
        }
        fetchData();
    }, [url, JSON.stringify(options)]);

    return {data, loading, error};
}

export default useFetch;
