import { useRef, useEffect } from 'react'
import { createRenderer, renderExercise } from '../services/renderService'

const MusicCanvas = (props) => {
    const canvasRef = useRef(null)
    const rendererRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current) {
            if (!rendererRef.current) {
                rendererRef.current = createRenderer(canvasRef.current)
            }

            renderExercise(rendererRef.current)
        }

        return () => {
            if (rendererRef.current) {
                rendererRef.current.getContext().clear()
            }
        }
    }, [])

    return (
        <div>
            <div ref={canvasRef} style={{border: "solid black"}}></div>
            {props.children}
        </div>
    )
}

export default MusicCanvas