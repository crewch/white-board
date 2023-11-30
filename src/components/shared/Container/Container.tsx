'use client'

import ColorInput from '@/components/ui/ColorInput/ColorInput'
import Board from '../Border/Board'
import styles from './Container.module.scss'
import { useState } from 'react'

import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

const Container = () => {
	const [color, setColor] = useState('#000000')

	return (
		<div className={styles.container}>
			<div className={styles.colorPicker}>
				<ColorInput color={color} setColor={setColor} />
			</div>
			<div className={styles.boardContainer}>
				<Board color={color} socket={socket} />
			</div>
		</div>
	)
}

export default Container
