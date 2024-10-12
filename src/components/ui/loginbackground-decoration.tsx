import { motion } from 'framer-motion'

export default function LoginBackgroundDecoration() {
  return (
    <div className="fixed inset-0 -z-12 overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-0 w-1/3 h-full bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300 rounded-full opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -top-1/2 right-0 w-1/3 h-full bg-gradient-to-tl from-indigo-200 via-blue-200 to-cyan-200 rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  )
}