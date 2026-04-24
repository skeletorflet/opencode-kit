import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ClaimFormState {
  draft: any
  savedAt: Date | null
  saveDraft: (data: any) => void
  loadDraft: () => any
  clearDraft: () => void
  isDirty: boolean
  setDirty: (dirty: boolean) => void
}

export const useClaimFormStore = create<ClaimFormState>()(
  persist(
    (set, get) => ({
      draft: null,
      savedAt: null,
      isDirty: false,
      
      saveDraft: (data) => {
        set({
          draft: data,
          savedAt: new Date(),
          isDirty: false
        })
      },
      
      loadDraft: () => {
        const state = get()
        return state.draft
      },
      
      clearDraft: () => {
        set({
          draft: null,
          savedAt: null,
          isDirty: false
        })
      },
      
      setDirty: (dirty) => {
        set({ isDirty: dirty })
      }
    }),
    {
      name: 'claim-form-draft',
      partialize: (state) => ({
        draft: state.draft,
        savedAt: state.savedAt
      })
    }
  )
)