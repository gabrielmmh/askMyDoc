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
            router.push('/')
        } else {
            alert('Google login failed.')
            router.push('/login')
        }
    }, [router])

    return <p className="text-center mt-10">Carregando...</p>
}
