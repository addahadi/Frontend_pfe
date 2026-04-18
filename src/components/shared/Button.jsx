/**
 * Button — shared button component
 * variants: primary | secondary | danger | ghost
 * sizes: sm | md | lg
 */
export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  type     = 'button',
  disabled = false,
  onClick,
  className = '',
  icon,
}) {
  const base = [
    'inline-flex items-center gap-1.5 font-semibold rounded-lg',
    'transition-all duration-150 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' ');

  const variants = {
    primary  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 focus:ring-slate-400',
    danger   : 'bg-white text-red-500 hover:bg-red-50 border border-red-200 focus:ring-red-400',
    ghost    : 'text-blue-600 hover:text-blue-800 hover:underline focus:ring-blue-300 border border-transparent bg-transparent',
  };

  const sizes = {
    sm : 'text-xs px-3 py-1.5',
    md : 'text-sm px-4 py-2',
    lg : 'text-base px-5 py-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </button>
  );
}
