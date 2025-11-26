import { create } from 'zustand'

export interface Content {
    _id: number
    prompt: string
    generatedText?: string
    [key: string]: any // Allow additional fields from API
}

interface ContentStore {
    contents: Content[]
    loading: boolean
    error: string | null
    setContents: (contents: Content[]) => void
    addContent: (content: Content) => void
    updateContent: (id: string | number, content: Partial<Content>) => void
    deleteContent: (id: string | number) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useContentStore = create<ContentStore>((set) => ({
    contents: [],
    loading: false,
    error: null,
    setContents: (contents) => set({ contents }),
    addContent: (content) =>
        set((state) => ({ contents: [...state.contents, content] })),
    updateContent: (id, updatedContent) =>
        set((state) => ({
            contents: state.contents.map((content) =>
                content._id === id ? { ...content, ...updatedContent } : content
            ),
        })),
    deleteContent: (id) =>
        set((state) => ({
            contents: state.contents.filter((content) => content._id !== id),
        })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}))

