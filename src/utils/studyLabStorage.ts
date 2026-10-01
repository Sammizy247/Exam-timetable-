import { StudyLabMaterial } from '../types/studyLab';
import { DEFAULT_STUDY_MATERIALS } from '../data/defaultStudyLabData';

const STORAGE_KEY = 'exam_command_study_lab_materials_v1';

export function getStudyMaterials(): StudyLabMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDY_MATERIALS));
      return DEFAULT_STUDY_MATERIALS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDY_MATERIALS));
      return DEFAULT_STUDY_MATERIALS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read study lab materials from storage', e);
    return DEFAULT_STUDY_MATERIALS;
  }
}

export function saveStudyMaterials(materials: StudyLabMaterial[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {
    console.error('Failed to save study lab materials to storage', e);
  }
}

export function addStudyMaterial(material: StudyLabMaterial): StudyLabMaterial[] {
  const current = getStudyMaterials();
  const updated = [material, ...current.filter((m) => m.id !== material.id)];
  saveStudyMaterials(updated);
  return updated;
}

export function updateStudyMaterial(updatedMat: StudyLabMaterial): StudyLabMaterial[] {
  const current = getStudyMaterials();
  const updated = current.map((m) => (m.id === updatedMat.id ? updatedMat : m));
  saveStudyMaterials(updated);
  return updated;
}

export function deleteStudyMaterial(materialId: string): StudyLabMaterial[] {
  const current = getStudyMaterials();
  const updated = current.filter((m) => m.id !== materialId);
  saveStudyMaterials(updated);
  return updated;
}

export function resetStudyMaterials(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset study lab materials', e);
  }
}
