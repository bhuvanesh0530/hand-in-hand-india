import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Beneficiary, Toast, AppState } from '../types';

interface AppContextType extends AppState {
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;
  showToast: (type: Toast['type'], message: string) => void;
  dismissToast: (id: string) => void;
  getCategoryPath: (categoryId: string) => Category[];
  getChildCategories: (parentId: string | null) => Category[];
  getBeneficiariesByCategory: (categoryId: string) => Beneficiary[];
  getCategoryById: (id: string) => Category | undefined;
  getBeneficiaryById: (id: string) => Beneficiary | undefined;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  refreshData: () => Promise<void>;
}

const initialState: AppState = {
  categories: [],
  beneficiaries: [],
  isLoading: true,
  toasts: [],
};

type Action =
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_BENEFICIARIES'; payload: Beneficiary[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'DISMISS_TOAST'; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_BENEFICIARIES':
      return { ...state, beneficiaries: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const fetchData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [catRes, benRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('beneficiaries').select('*').order('created_at', { ascending: false }),
      ]);
      if (catRes.data) dispatch({ type: 'SET_CATEGORIES', payload: catRes.data });
      if (benRes.data) dispatch({ type: 'SET_BENEFICIARIES', payload: benRes.data });
    } catch (err) {
      showToast('error', 'Failed to load data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchData();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const showToast = (type: Toast['type'], message: string) => {
    const toast: Toast = { id: generateId(), type, message };
    dispatch({ type: 'ADD_TOAST', payload: toast });
    setTimeout(() => dispatch({ type: 'DISMISS_TOAST', payload: toast.id }), 4000);
  };

  const dismissToast = (id: string) => {
    dispatch({ type: 'DISMISS_TOAST', payload: id });
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('categories').insert([category]);
    if (error) { showToast('error', 'Failed to add category'); throw error; }
    await fetchData();
    showToast('success', 'Category added successfully!');
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await supabase.from('categories').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { showToast('error', 'Failed to update category'); throw error; }
    await fetchData();
    showToast('success', 'Category updated successfully!');
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { showToast('error', 'Failed to delete category'); throw error; }
    await fetchData();
    showToast('success', 'Category deleted successfully!');
  };

  const addBeneficiary = async (beneficiary: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('beneficiaries').insert([beneficiary]);
    if (error) { showToast('error', 'Failed to add beneficiary'); throw error; }
    await fetchData();
    showToast('success', 'Beneficiary added successfully!');
  };

  const updateBeneficiary = async (id: string, updates: Partial<Beneficiary>) => {
    const { error } = await supabase.from('beneficiaries').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { showToast('error', 'Failed to update beneficiary'); throw error; }
    await fetchData();
    showToast('success', 'Beneficiary updated successfully!');
  };

  const deleteBeneficiary = async (id: string) => {
    const { error } = await supabase.from('beneficiaries').delete().eq('id', id);
    if (error) { showToast('error', 'Failed to delete beneficiary'); throw error; }
    await fetchData();
    showToast('success', 'Beneficiary deleted successfully!');
  };

  const getCategoryPath = (categoryId: string): Category[] => {
    const path: Category[] = [];
    let current = state.categories.find(c => c.id === categoryId);
    while (current) {
      path.unshift(current);
      current = current.parent_id
        ? state.categories.find(c => c.id === current?.parent_id)
        : undefined;
    }
    return path;
  };

  const getChildCategories = (parentId: string | null): Category[] => {
    return state.categories
      .filter(c => c.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const getBeneficiariesByCategory = (categoryId: string): Beneficiary[] => {
    const getAllDescendantIds = (pid: string): string[] => {
      const children = state.categories.filter(c => c.parent_id === pid);
      return children.reduce(
        (acc, child) => [...acc, child.id, ...getAllDescendantIds(child.id)],
        [] as string[]
      );
    };
    const ids = [categoryId, ...getAllDescendantIds(categoryId)];
    return state.beneficiaries.filter(b => ids.includes(b.category_id));
  };

  const getCategoryById = (id: string) => state.categories.find(c => c.id === id);
  const getBeneficiaryById = (id: string) => state.beneficiaries.find(b => b.id === id);

  return (
    <AppContext.Provider value={{
      ...state,
      isAdmin,
      setIsAdmin,
      addCategory,
      updateCategory,
      deleteCategory,
      addBeneficiary,
      updateBeneficiary,
      deleteBeneficiary,
      showToast,
      dismissToast,
      getCategoryPath,
      getChildCategories,
      getBeneficiariesByCategory,
      getCategoryById,
      getBeneficiaryById,
      refreshData: fetchData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}