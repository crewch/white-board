import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './Board.module.scss'
import { Socket } from 'socket.io-client'

interface BoardProps {
	socket: Socket
	color: string
}

const Board: FC<BoardProps> = ({ color, socket }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const contextRef = useRef<CanvasRenderingContext2D | null>(null)
	const [boardData, setBoardData] = useState<string>()

	const drawOnCanvas = () => {
		const canvas = canvasRef.current as HTMLCanvasElement
		const context = canvas.getContext('2d') as CanvasRenderingContext2D
		contextRef.current = context

		if (!canvas || !context) {
			return
		}

		const sketch = document.querySelector('#sketch')
		const sketchStyle = getComputedStyle(sketch as Element)
		canvas.width = parseInt(sketchStyle.getPropertyValue('width'))
		canvas.height = parseInt(sketchStyle.getPropertyValue('height'))

		const mouse = { x: 0, y: 0 }
		const lastMouse = { x: 0, y: 0 }

		const mouseMoveHandler = (e: MouseEvent) => {
			lastMouse.x = mouse.x
			lastMouse.y = mouse.y

			mouse.x = e.pageX - canvas.offsetLeft
			mouse.y = e.pageY - canvas.offsetTop
		}

		canvas.addEventListener('mousemove', mouseMoveHandler, false)

		context.lineWidth = 5
		context.lineJoin = 'round'
		context.lineCap = 'round'
		context.strokeStyle = color

		const onPaint = () => {
			context.beginPath()
			context.moveTo(lastMouse.x, lastMouse.y)
			context.lineTo(mouse.x, mouse.y)
			context.closePath()
			context.stroke()

			setTimeout(() => setBoardData(canvas.toDataURL('image/png')), 1000)
		}

		const startDrawing = (e: MouseEvent) => {
			canvas.addEventListener('mousemove', onPaint, false)
		}

		const stopDrawing = () => {
			canvas.removeEventListener('mousemove', onPaint, false)
		}

		canvas.addEventListener('mousedown', startDrawing, false)
		canvas.addEventListener('mouseup', stopDrawing, false)
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(drawOnCanvas, [])

	useEffect(() => {
		const context = contextRef.current
		if (context) {
			context.strokeStyle = color
		}
	}, [color])

	useEffect(() => {
		socket.emit('canvas-data', boardData)
	}, [boardData, socket])

	useEffect(() => {
		socket.on('canvas-data', (data: string) => {
			const image = new Image()
			const canvas = canvasRef.current
			const context = contextRef.current

			if (!canvas || !context) {
				return
			}

			image.onload = () => context.drawImage(image, 0, 0)
			image.src = data
		})
	}, [socket])

	return (
		<div className={styles.sketch} id='sketch'>
			<canvas ref={canvasRef} className={styles.board} id='board' />
		</div>
	)
}

export default Board
