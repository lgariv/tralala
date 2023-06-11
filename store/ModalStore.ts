import { create } from "zustand";

interface ModalState {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	isEditing: boolean;
	task: Todo | null | undefined;
	setEditing: (isEditing: boolean, task: Todo | null | undefined) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
	isOpen: false,
	openModal: () => set({ isOpen: true }),
	closeModal: () => set({ isOpen: false }),
	isEditing: false,
	task: null,
	setEditing: (isEditing: boolean, task: Todo | null | undefined) => set({ isEditing: isEditing, task: task }),
}));