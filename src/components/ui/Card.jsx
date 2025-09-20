function Card({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-md',
  hover = false 
}) {
  const hoverEffect = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200' : ''
  
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${shadow} ${padding} ${hoverEffect} ${className}`}>
      {children}
    </div>
  )
}

export default Card