export interface LessonTest {
  name: string;
  run: (code: string) => boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: "explanation" | "exercise";
  content?: string;
  instructions?: string;
  starterCode?: string;
  solution?: string;
  tests?: LessonTest[];
  hint?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}
