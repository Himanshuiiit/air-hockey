import { useRef, useEffect } from 'react'

const useCanvas = init => {
  
  const ref = useRef(null)
  
  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d')
    addEventListener("resize", () => {
      canvas.width = window.innerWidth - 5;
      canvas.height = window.innerHeight - 5;
      init(context);
    });
    let animationId
    
    const renderer = () => {
      init(context)
      animationId = window.requestAnimationFrame(renderer)
    }
    renderer()
    
    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [init])
  
  return ref
}

export default useCanvas