interface InputProps {
  type: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

function Input({type, placeholder, className, ...props}: InputProps) {
  return (
    <input type={type} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`} {...props} />
  )
}

export default Input