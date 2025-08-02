import type { InsertStudent, Student, InsertQuestion, Question } from '@shared/schema';

// Simple localStorage-based database for demo
// In production, you would use Replit Database API directly
export class DatabaseService {
  private getFromStorage(key: string): any {
    try {
      const item = localStorage.getItem(`eduvoice_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(`eduvoice_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Student operations
  async createStudent(studentData: InsertStudent): Promise<Student> {
    const id = this.generateId();
    const student: Student = {
      id,
      ...studentData,
      language: studentData.language || 'en',
      createdAt: new Date(),
    };
    
    this.saveToStorage(`student:${student.userId}`, student);
    this.saveToStorage(`student_by_id:${id}`, student);
    
    return student;
  }

  async getStudent(userId: string): Promise<Student | null> {
    try {
      const student = this.getFromStorage(`student:${userId}`);
      if (student && student.createdAt) {
        student.createdAt = new Date(student.createdAt);
      }
      return student;
    } catch (error) {
      console.error('Error getting student:', error);
      return null;
    }
  }

  async getStudentById(id: string): Promise<Student | null> {
    try {
      const student = this.getFromStorage(`student_by_id:${id}`);
      if (student && student.createdAt) {
        student.createdAt = new Date(student.createdAt);
      }
      return student;
    } catch (error) {
      console.error('Error getting student by id:', error);
      return null;
    }
  }

  // Question operations
  async saveQuestion(questionData: InsertQuestion): Promise<Question> {
    const id = this.generateId();
    const question: Question = {
      id,
      ...questionData,
      language: questionData.language || 'en',
      createdAt: new Date(),
    };
    
    this.saveToStorage(`question:${id}`, question);
    
    // Add to student's question list
    const studentQuestions = this.getStudentQuestions(questionData.studentId);
    studentQuestions.unshift(id); // Add to front for recent first
    this.saveToStorage(`student_questions:${questionData.studentId}`, studentQuestions);
    
    return question;
  }

  async getRecentQuestions(studentId: string, limit = 10): Promise<Question[]> {
    try {
      const questionIds = this.getStudentQuestions(studentId);
      const recentIds = questionIds.slice(0, limit);
      
      const questions: Question[] = [];
      for (const id of recentIds) {
        const question = this.getFromStorage(`question:${id}`);
        if (question) {
          if (question.createdAt) {
            question.createdAt = new Date(question.createdAt);
          }
          questions.push(question);
        }
      }
      
      return questions;
    } catch (error) {
      console.error('Error getting recent questions:', error);
      return [];
    }
  }

  private getStudentQuestions(studentId: string): string[] {
    try {
      const questions = this.getFromStorage(`student_questions:${studentId}`);
      return Array.isArray(questions) ? questions : [];
    } catch (error) {
      return [];
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

export const databaseService = new DatabaseService();