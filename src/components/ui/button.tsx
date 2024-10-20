import { motion, MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
} & MotionProps; // Use MotionProps instead of React.ButtonHTMLAttributes

const Button = ({
  children,
  type,
  isLoading,
  onClick,
  className = '',
  ...motionProps // Spread other motion props
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`w-full bg-indigo-600 text-white rounded-lg py-2 px-4 font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
      {...motionProps} // Spread other motion attributes
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
