import { create } from 'zustand';

interface SetupState {
  step: number;
  formData: {
    phone: string;
    address: string;
    birthdate: string;
    photo: string;
    familyId: string | null;
    newFamilyName: string;
  };
  setStep: (step: number) => void;
  setFormData: (data: Partial<SetupState['formData']>) => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  step: 1,
  formData: {
    phone: '',
    address: '',
    birthdate: '',
    photo: '',
    familyId: null,
    newFamilyName: '',
  },
  setStep: (step) => set({ step }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
}));
