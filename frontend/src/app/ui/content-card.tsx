'use client'

import { Content } from '@/app/store/contentStore'
import { useState } from 'react'

interface ContentCardProps {
    content: Content
    onEdit: (content: Content) => void
    onDelete: (id: string | number) => void
}

export default function ContentCard({ content, onEdit, onDelete }: ContentCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            setIsDeleting(true)
            await onDelete(content._id)
            setIsDeleting(false)
            setIsDeleting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">
                    {content.prompt}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(content)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
            {content.generatedText && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 clamp-5">
                    {content.generatedText}
                </p>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
                ID: {content._id}
            </div>
        </div>
    )
}