import React, { useEffect } from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Link } from 'react-router-dom';
// import axios from 'axios';
const Home : React.FC = () => {
  useEffect(() => {
    document.title = 'Home';
  }, []);
  const {auth} = useContext(AuthContext);

  
  // interface Message{
  //   sender: string;
  //   text: string;
  // }
  // const [message, setMessage] = useState<Message[]>([]);
  // const [input, setInput] = useState('');

  // const sendMessage = async () => {
  
    
  //   console.log("message", input.trim());
  //   if(!input.trim()) return;
  //   setMessage([...message, {sender: "You", text: input}]);
  //   setInput('');
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/v1/chat', {message: input});
  //     setMessage([...message, {sender: "You", text: input}, {sender: "Bot", text: response.data.reply}]);
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // }
  return (
    <>
    <div className='flex flex-col justify-center items-center'>
      <img src={auth?.avatar} alt="avatar" className='w-50 h-50 mb-3 rounded-full' /> 
      <div className='text-4xl font-bold'> Hi <span className='text-blue-500 capitalize'>{auth?.fullName}</span> Welcome to the Home Page </div>
      <Link title='Go to Products to perform CRUD operations' to={'/products'} className='text-black-500 bg-amber-200 px-4 py-2 rounded-md mt-4'> Go to Products </Link>
      <p className='text-gray-500 text-sm mt-2'>You can add, edit and delete products</p>
    </div>
    {/* <div className='flex flex-col justify-center items-center'>
      <div className='w-full max-w-md p-4 border border-gray-300 rounded-lg mb-4'>
        {message.map((msg: {sender: string, text: string}, index: number) => (
            <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.text}
                </div>
            </div>
        ))}
      </div>
      <div className='w-full max-w-md p-4 border border-gray-300 rounded-lg mb-4'>
        <input type='text' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type your message...' className='w-full p-2 rounded-md border border-gray-300' />
        <button onClick={sendMessage} className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2'>Send</button>
      </div>
    </div> */}
    </>
  )
}

export default Home;