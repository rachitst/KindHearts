// Create a new reusable button component
export const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-white',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}; 