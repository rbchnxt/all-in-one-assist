import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Database, Users, MessageSquare, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoredStudent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: string;
  language: string;
  createdAt: string;
  [key: string]: any;
}

interface StoredQuestion {
  id: string;
  studentId: string;
  question: string;
  answer: string;
  language: string;
  createdAt: string;
}

interface AuthCredential {
  id: string;
  email: string;
  name: string;
  password: string;
  authProvider: string;
}

export function DatabaseViewer() {
  const [students, setStudents] = useState<StoredStudent[]>([]);
  const [questions, setQuestions] = useState<StoredQuestion[]>([]);
  const [credentials, setCredentials] = useState<AuthCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = () => {
    setLoading(true);
    
    try {
      // Load students
      const studentData: StoredStudent[] = [];
      const questionData: StoredQuestion[] = [];
      const credentialData: AuthCredential[] = [];

      // Scan localStorage for all EduVoice data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith('eduvoice_')) continue;

        const value = localStorage.getItem(key);
        if (!value) continue;

        try {
          const parsed = JSON.parse(value);

          if (key.startsWith('eduvoice_student:')) {
            studentData.push(parsed);
          } else if (key.startsWith('eduvoice_question:')) {
            questionData.push(parsed);
          } else if (key.startsWith('eduvoice_credentials_')) {
            credentialData.push(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse data for key:', key);
        }
      }

      setStudents(studentData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setQuestions(questionData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setCredentials(credentialData);
      
    } catch (error) {
      console.error('Error loading database:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load database contents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    if (!confirm('Are you sure you want to clear all database data? This cannot be undone.')) {
      return;
    }

    // Remove all EduVoice data from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('eduvoice_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    loadData();
    toast({
      title: "Database cleared",
      description: "All data has been removed from the database",
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 h-8 w-8 text-blue-600" />
          <p>Loading database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Viewer</h1>
              <p className="text-gray-600">EduVoice Development Database</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={clearAllData} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-3xl font-bold text-green-600">{questions.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Auth Accounts</p>
                  <p className="text-3xl font-bold text-purple-600">{credentials.length}</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
            <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
            <TabsTrigger value="auth">Authentication ({credentials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            {students.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No students found in the database
                </CardContent>
              </Card>
            ) : (
              students.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{student.firstName} {student.lastName}</span>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">{student.grade}</Badge>
                        <Badge variant="outline">{student.language.toUpperCase()}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>School:</strong> {student.school}</p>
                        <p><strong>User ID:</strong> {student.userId}</p>
                        <p><strong>Created:</strong> {formatDate(student.createdAt)}</p>
                      </div>
                      <div>
                        {student.city && <p><strong>City:</strong> {student.city}, {student.state}</p>}
                        {student.parentEmail && <p><strong>Parent Email:</strong> {student.parentEmail}</p>}
                        {student.parentPhone && <p><strong>Parent Phone:</strong> {student.parentPhone}</p>}
                        {student.dateOfBirth && <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            {questions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No questions found in the database
                </CardContent>
              </Card>
            ) : (
              questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Q&A Session</span>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">{formatDate(question.createdAt)}</Badge>
                        <Badge variant="outline">{question.language.toUpperCase()}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium mb-1">Question:</p>
                        <p className="text-gray-900">{question.question}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 font-medium mb-1">Answer:</p>
                        <p className="text-gray-900">{question.answer}</p>
                      </div>
                      <p className="text-xs text-gray-500">Student ID: {question.studentId}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            {credentials.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No authentication credentials found
                </CardContent>
              </Card>
            ) : (
              credentials.map((cred) => (
                <Card key={cred.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{cred.name}</span>
                      <Badge variant={cred.authProvider === 'google' ? 'default' : 'secondary'}>
                        {cred.authProvider}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> {cred.email}</p>
                      <p><strong>User ID:</strong> {cred.id}</p>
                      <p><strong>Password:</strong> {cred.password ? '••••••••' : 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}