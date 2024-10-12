import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

type InputProps = {
  name: string
  type: string
  placeholder: string
  icon: 'user' | 'mail' | 'lock'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

const iconComponents = {
  user: User,
  mail: Mail,
  lock: Lock,
}

export default function Input({ name, type, placeholder, icon, value, onChange, required }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const IconComponent = iconComponents[icon]

  return (
    <motion.div
      className="relative"
      whileTap={{ scale: 0.995 }}
    >
      <input
        name={name}
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pl-10 pr-10"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <motion.span
        className="absolute left-3 top-2.5 text-gray-400"
        initial={false}
        animate={{ scale: isFocused ? 0.9 : 1 }}
      >
        <IconComponent size={20} />
      </motion.span>
      {type === 'password' && (
        <button
          type="button"
          className="absolute right-3 top-2.5 text-gray-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </motion.div>
  )
}
