import curriculumData from "@/data/curriculum.json";

export interface CurriculumModule {
  n: number;
  title: string;
  days: number[];
}

export interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export const curriculumModules: CurriculumModule[] = curriculumData.modules;
export const curriculum: CurriculumDay[] = curriculumData.days;

export function getCurriculumDay(day: number): CurriculumDay | undefined {
  return curriculum.find((d) => d.day === day);
}

export function getModuleForDay(day: number): CurriculumModule | undefined {
  return curriculumModules.find((m) => m.days.includes(day));
}
