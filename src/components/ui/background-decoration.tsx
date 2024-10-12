import { motion } from 'framer-motion'

export default function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 -z-12 overflow-hidden">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 rounded-full opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-200 via-teal-200 to-green-200 rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -45, 0],
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