'use client'

import { Content } from '@/app/store/contentStore'
import { useState, useEffect } from 'react'

interface ContentFormProps {
    content?: Content | null
    onSave: (content: { prompt: string; contentType: string; generatedText?: string }) => Promise<void>
    onCancel: () => void
}

const CONTENT_TYPES = [
    { value: 'blog-outline', label: 'Blog Post Outline' },
    { value: 'product-description', label: 'Product Description' },
    { value: 'social-media-caption', label: 'Social Media Caption' },
] as const

export default function ContentForm({ content, onSave, onCancel }: ContentFormProps) {
    const [prompt, setPrompt] = useState('')
    const [contentType, setContentType] = useState<string>('blog-outline')
    const [generatedText, setGeneratedText] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (content) {
            setPrompt(content.prompt || '')
            setContentType((content as any).contentType || 'blog-outline')
            setGeneratedText(content.generatedText || '')
        } else {
            setPrompt('')
            setContentType('blog-outline')
            setGeneratedText('')
        }
    }, [content])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!prompt.trim()) {
            setError('Prompt is required')
            return
        }

        setIsSaving(true)
        try {
            await onSave({ 
                prompt: prompt.trim(), 
                contentType: contentType,
                generatedText: generatedText.trim() || undefined 
            })
            setPrompt('')
            setContentType('blog-outline')
            setGeneratedText('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save content')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-zinc-100">
                    {content ? 'Edit Content' : 'Add New Content'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="contentType" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Content Type *
                        </label>
                        <select
                            id="contentType"
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                            required
                        >
                            {CONTENT_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Prompt *
                        </label>
                        <input
                            id="prompt"
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="generatedText" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            GeneratedText
                        </label>
                        <textarea
                            id="generatedText"
                            value={generatedText}
                            onChange={(e) => setGeneratedText(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                        />
                    </div>
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : content ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

