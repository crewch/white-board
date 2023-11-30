import { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage/HomePage'

export const metadata: Metadata = {
	title: 'White Board',
	description: 'White Board',
}

export default function Home() {
	return <HomePage />
}
