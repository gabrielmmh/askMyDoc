'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')

        if (token) {
            localStorage.setItem('token', token)
            router.push('/home')
        } else {
            alert('Google login failed.')
            router.push('/login')
        }
    }, [])

    return <p className="text-center mt-10">Loading...</p>
}
