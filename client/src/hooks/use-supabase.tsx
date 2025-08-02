import { useState } from 'react';
import { databaseService } from '@/lib/database';
import type { InsertStudent, Student, InsertQuestion, Question } from '@shared/schema';

export function useDatabase() {
  const [loading, setLoading] = useState(false);

  const createStudent = async (studentData: InsertStudent): Promise<Student> => {
    setLoading(true);
    try {
      return await databaseService.createStudent(studentData);
    } finally {
      setLoading(false);
    }
  };

  const getStudent = async (userId: string): Promise<Student | null> => {
    setLoading(true);
    try {
      return await databaseService.getStudent(userId);
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = async (questionData: InsertQuestion): Promise<Question> => {
    setLoading(true);
    try {
      return await databaseService.saveQuestion(questionData);
    } finally {
      setLoading(false);
    }
  };

  const getRecentQuestions = async (studentId: string, limit = 10): Promise<Question[]> => {
    setLoading(true);
    try {
      return await databaseService.getRecentQuestions(studentId, limit);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createStudent,
    getStudent,
    saveQuestion,
    getRecentQuestions,
  };
}
