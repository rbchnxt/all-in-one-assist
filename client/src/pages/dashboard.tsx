import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDatabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { VoiceRecorder } from '@/components/voice-recorder';
import { AnswerModal } from '@/components/answer-modal';
import { LoadingOverlay } from '@/components/loading-overlay';
import { llamaService } from '@/lib/llama';
import { GraduationCap, LogOut, Brain, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Student, Question } from '@shared/schema';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { getStudent, getRecentQuestions, saveQuestion } = useDatabase();
  const [student, setStudent] = useState<Student | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [textQuestion, setTextQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const studentData = await getStudent(user.id);
      setStudent(studentData);
      
      if (studentData) {
        const questions = await getRecentQuestions(studentData.id);
        setRecentQuestions(questions);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!question.trim() || !student) return;

    setCurrentQuestion(question);
    setCurrentAnswer('');
    setIsAnswerModalOpen(true);
    setIsLoadingAnswer(true);

    try {
      const answer = await llamaService.askQuestion(question, `Student grade: ${student.grade}`);
      setCurrentAnswer(answer);
      
      // Save question to database
      await saveQuestion({
        studentId: student.id,
        question,
        answer,
        language: student.language,
      });

      // Refresh recent questions
      const updatedQuestions = await getRecentQuestions(student.id);
      setRecentQuestions(updatedQuestions);
      
    } catch (error) {
      toast({
        title: "Failed to get answer",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setIsAnswerModalOpen(false);
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      handleQuestionSubmit(transcript);
    }
  };

  const handleTextSubmit = () => {
    if (textQuestion.trim()) {
      handleQuestionSubmit(textQuestion);
      setTextQuestion('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) === 1 ? '' : 's'} ago`;
    return 'Yesterday';
  };

  if (isLoadingData) {
    return <LoadingOverlay isVisible={true} message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduVoice</h1>
                <p className="text-xs text-gray-500">Learning Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {student ? `${student.firstName} ${student.lastName}` : user?.name || user?.email}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{student?.grade}</span>
              </div>
              
              <div className="relative">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {student?.firstName?.charAt(0) || user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {student?.firstName || user?.name?.split(' ')[0] || 'Student'}! 👋
              </h2>
              <p className="text-blue-100 text-lg">Ready to learn something new today?</p>
            </div>
            <div className="hidden md:block">
              <div className="h-20 w-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <Brain className="text-4xl h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Interaction Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ask Your Question</h3>
              <p className="text-gray-600 mb-8">Click the button below and speak your question. I'll help you learn!</p>
              
              <VoiceRecorder 
                onTranscript={handleVoiceTranscript}
                language={student?.language === 'en' ? 'en-US' : student?.language || 'en-US'}
              />

              {/* Alternative Text Input */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Or type your question below:</p>
                <div className="flex space-x-3">
                  <Input
                    type="text"
                    placeholder="Type your question here..."
                    value={textQuestion}
                    onChange={(e) => setTextQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    className="flex-1 rounded-xl"
                  />
                  <Button 
                    onClick={handleTextSubmit}
                    disabled={!textQuestion.trim()}
                    className="px-6 rounded-xl"
                  >
                    Ask
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question History */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Questions</h3>
              <Button variant="link" className="text-sm text-primary hover:text-blue-700">
                View All
              </Button>
            </div>
            
            {recentQuestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions yet. Ask your first question above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentQuestions.map((question) => (
                  <div 
                    key={question.id}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setCurrentQuestion(question.question);
                      setCurrentAnswer(question.answer);
                      setIsAnswerModalOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{question.question}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {question.answer.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                          {question.createdAt ? formatTimeAgo(new Date(question.createdAt)) : 'Unknown'}
                        </span>
                        <ChevronRight className="text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Answer Modal */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        question={currentQuestion}
        answer={currentAnswer}
        isLoading={isLoadingAnswer}
        onFollowUp={() => {
          setIsAnswerModalOpen(false);
          // Could implement follow-up functionality here
        }}
      />
    </div>
  );
}
