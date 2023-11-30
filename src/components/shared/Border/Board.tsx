'use client'

import { FC, useEffect, useState } from 'react'
import styles from './Board.module.scss'
import { Socket } from 'socket.io-client'

interface BoardProps {
	socket: Socket
	color: string
}

const Board: FC<BoardProps> = ({ color, socket }) => {
	const [boardData, setBoardData] = useState<string>()

	let timeout: { data: any } = { data: '' }

	const drawOnCanvas = () => {
		let canvas = document.querySelector('#board') as HTMLCanvasElement

		let ctx = canvas.getContext('2d') as CanvasRenderingContext2D

		let sketch = document.querySelector('#sketch') as HTMLCanvasElement

		let sketch_style = getComputedStyle(sketch)
		canvas.width = parseInt(sketch_style.getPropertyValue('width'))

		canvas.height = parseInt(sketch_style.getPropertyValue('height'))

		let mouse = { x: 0, y: 0 }
		let last_mouse = { x: 0, y: 0 }

		canvas.addEventListener(
			'mousemove',
			function (e) {
				last_mouse.x = mouse.x
				last_mouse.y = mouse.y

				mouse.x = e.pageX - this.offsetLeft
				mouse.y = e.pageY - this.offsetTop
			},
			false
		)

		ctx.lineWidth = 5
		ctx.lineJoin = 'round'
		ctx.lineCap = 'round'
		ctx.strokeStyle = color

		let onPaint = function () {
			ctx.beginPath()
			ctx.moveTo(last_mouse.x, last_mouse.y)
			ctx.lineTo(mouse.x, mouse.y)
			ctx.closePath()
			ctx.stroke()

			if (timeout.data != undefined) {
				clearTimeout(timeout.data)
			}

			timeout.data = setTimeout(() => {
				setBoardData(canvas.toDataURL('image/png'))
			}, 1000)
		}

		canvas.addEventListener(
			'mousedown',
			function (e) {
				canvas.addEventListener('mousemove', onPaint, false)
			},
			false
		)

		canvas.addEventListener(
			'mouseup',
			function () {
				canvas.removeEventListener('mousemove', onPaint, false)
			},
			false
		)
	}

	useEffect(() => {
		drawOnCanvas()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const canvas = document.querySelector('#board') as HTMLCanvasElement

		if (canvas) {
			const ctx = canvas.getContext('2d')

			if (ctx) {
				ctx.strokeStyle = color
			}
		}
	}, [color])

	useEffect(() => {
		socket.emit('canvas-data', { boardData })
	}, [boardData, socket])

	useEffect(() => {
		socket.on('canvas-data', data => {
			const image = new Image()
			const canvas = document.querySelector('#board') as HTMLCanvasElement
			let ctx = canvas.getContext('2d') as CanvasRenderingContext2D
			image.onload = () => ctx.drawImage(image, 0, 0)
			image.src = data
		})
	}, [socket])

	return (
		<div className={styles.sketch} id='sketch'>
			<canvas className={styles.board} id='board' />
		</div>
	)
}

export default Board
