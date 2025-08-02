import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDatabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertStudentSchema, type InsertStudent } from '@shared/schema';
import { User, Info, MapPin, Calendar, Phone, Mail, School, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegistrationFormData extends Omit<InsertStudent, 'userId' | 'email'> {}

export function RegistrationPage() {
  const { user } = useAuth();
  const { createStudent, loading } = useDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(insertStudentSchema.omit({ userId: true, email: true })),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      dateOfBirth: '',
      school: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      grade: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      language: 'en',
      timezone: 'America/New_York',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createStudent({
        ...data,
        userId: user.id,
        email: user.email,
      });
      
      toast({
        title: "Registration complete!",
        description: "Welcome to EduVoice. You can now start asking questions.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <LoadingOverlay isVisible={isSubmitting} message="Creating your profile..." />
      
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="text-white text-sm h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">Step 1 of 1</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-full transition-all duration-300"></div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <User className="text-primary mr-3 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      {...form.register('firstName')}
                      className="rounded-xl"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      {...form.register('lastName')}
                      className="rounded-xl"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dateOfBirth" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...form.register('dateOfBirth')}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Globe className="mr-2 h-4 w-4" />
                      Preferred Language <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.watch('language')} onValueChange={(value) => form.setValue('language', value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <School className="text-primary mr-3 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Academic Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                      School/Institution <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="school"
                      placeholder="Enter your school name"
                      {...form.register('school')}
                      className="rounded-xl"
                    />
                    {form.formState.errors.school && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.school.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.watch('grade')} onValueChange={(value) => form.setValue('grade', value)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary (K-5)</SelectItem>
                        <SelectItem value="6">6th Grade</SelectItem>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                        <SelectItem value="9">9th Grade (Freshman)</SelectItem>
                        <SelectItem value="10">10th Grade (Sophomore)</SelectItem>
                        <SelectItem value="11">11th Grade (Junior)</SelectItem>
                        <SelectItem value="12">12th Grade (Senior)</SelectItem>
                        <SelectItem value="college-freshman">College Freshman</SelectItem>
                        <SelectItem value="college-sophomore">College Sophomore</SelectItem>
                        <SelectItem value="college-junior">College Junior</SelectItem>
                        <SelectItem value="college-senior">College Senior</SelectItem>
                        <SelectItem value="graduate">Graduate Student</SelectItem>
                        <SelectItem value="adult">Adult Learner</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.grade && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.grade.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <MapPin className="text-primary mr-3 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Address Information</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter your street address"
                    {...form.register('address')}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter your city"
                      {...form.register('city')}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      placeholder="Enter your state"
                      {...form.register('state')}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter your ZIP code"
                      {...form.register('zipCode')}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </Label>
                  <Select value={form.watch('country')} onValueChange={(value) => form.setValue('country', value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Phone className="text-primary mr-3 h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900">Parent/Guardian Information</h3>
                <span className="ml-2 text-sm text-gray-500">(Optional for 18+)</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                    Parent/Guardian Name
                  </Label>
                  <Input
                    id="parentName"
                    placeholder="Enter parent/guardian name"
                    {...form.register('parentName')}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="parentEmail" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="mr-2 h-4 w-4" />
                      Parent/Guardian Email
                    </Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      placeholder="parent@example.com"
                      {...form.register('parentEmail')}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parentPhone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="mr-2 h-4 w-4" />
                      Parent/Guardian Phone
                    </Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...form.register('parentPhone')}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <Info className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-2">About Your Data & Privacy</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Your information helps us personalize your learning experience and ensure age-appropriate content. 
                  All data is stored securely and used only for educational purposes.
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Personal information is encrypted and stored securely</li>
                  <li>• Parent/guardian info is used for account verification if needed</li>
                  <li>• You can update or delete your information anytime</li>
                  <li>• We never share your data with third parties without consent</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center space-x-4 pt-4">
            <Button 
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || isSubmitting}
              className="flex-1 py-3 px-6 rounded-xl font-medium"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Registration"}
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="px-6 py-3 rounded-xl"
              onClick={() => {
                // Could implement a basic profile with minimal info
                console.log("Skip for now clicked");
              }}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
