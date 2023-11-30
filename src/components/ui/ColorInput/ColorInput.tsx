'use client'

import { Dispatch, FC, SetStateAction } from 'react'
import styles from './ColorInput.module.scss'

interface ColorInputProps {
	color: string
	setColor: Dispatch<SetStateAction<string>>
}

const ColorInput: FC<ColorInputProps> = ({ color, setColor }) => {
	return (
		<input
			type='color'
			className={styles.inputColor}
			value={color}
			onChange={e => setColor(e.target.value)}
		/>
	)
}

export default ColorInput
