'use client'

import { useEffect, useState } from 'react'
import { useContentStore, Content } from '@/app/store/contentStore'
import { fetchContents, createContent, updateContent, deleteContent } from '@/app/actions/content'
import ContentCard from './content-card'
import ContentForm from './content-form'

export default function ContentList() {
    const {
        contents,
        loading,
        error,
        setContents,
        addContent,
        updateContent: updateContentInStore,
        deleteContent: deleteContentInStore,
        setLoading,
        setError,
    } = useContentStore()

    const [showForm, setShowForm] = useState(false)
    const [editingContent, setEditingContent] = useState<Content | null>(null)

    useEffect(() => {
        loadContents()
    }, [])

    const loadContents = async () => {
        setLoading(true)
        setError(null)
        const result = await fetchContents()
        if (result.success && result.data) {
            // Handle different API response formats
            const contentsArray = Array.isArray(result.data) ? result.data : result.data.contents || result.data.data || []
            setContents(contentsArray)
        } else {
            setError(result.error || 'Failed to load contents')
        }
        setLoading(false)
    }

    const handleAdd = () => {
        setEditingContent(null)
        setShowForm(true)
    }

    const handleEdit = (content: Content) => {
        setEditingContent(content)
        setShowForm(true)
    }

    const handleSave = async (contentData: { prompt: string; generatedText?: string }) => {
        if (editingContent) {
            // Update existing content
            const result = await updateContent(editingContent._id, contentData)
            if (result.success && result.data) {
                updateContentInStore(editingContent._id, result.data.content)
                setShowForm(false)
                setEditingContent(null)
            } else {
                throw new Error(result.error || 'Failed to update content')
            }
        } else {
            // Create new content
            const result = await createContent(contentData)
            if (result.success && result.data) {
                addContent(result.data.content)
                setShowForm(false)
            } else {
                throw new Error(result.error || 'Failed to create content')
            }
        }
    }

    const handleDelete = async (id: string | number) => {
        const result = await deleteContent(id)
        if (result.success) {
            deleteContentInStore(id)
        } else {
            alert(result.error || 'Failed to delete content')
        }
    }

    if (loading && contents.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading contents...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                    Contents
                </h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Add Content
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={loadContents}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {contents.length === 0 && !loading ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No contents found.</p>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Content
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contents.map((content) => (
                        <ContentCard
                            key={content._id}
                            content={content}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <ContentForm
                    content={editingContent}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false)
                        setEditingContent(null)
                    }}
                />
            )}
        </div>
    )
}

