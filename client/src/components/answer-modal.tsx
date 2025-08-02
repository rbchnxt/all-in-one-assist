import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translateService } from '@/lib/translate';
import { Bookmark, Share2, X } from 'lucide-react';

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
  isLoading: boolean;
  onSave?: () => void;
  onShare?: () => void;
  onFollowUp?: () => void;
}

export function AnswerModal({
  isOpen,
  onClose,
  question,
  answer,
  isLoading,
  onSave,
  onShare,
  onFollowUp,
}: AnswerModalProps) {
  const [translatedAnswer, setTranslatedAnswer] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!selectedLanguage || !translateService.isAvailable()) return;

    setIsTranslating(true);
    try {
      const translated = await translateService.translateText(answer, selectedLanguage);
      setTranslatedAnswer(translated);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const displayAnswer = translatedAnswer || answer;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden" aria-describedby="answer-description">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 -m-6 mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">AI Answer</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:text-gray-200 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div id="answer-description" className="overflow-y-auto max-h-[60vh] space-y-6">
          {/* Question Display */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Your question:</p>
            <p className="font-medium text-gray-900">{question}</p>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-gray-600">Getting your answer...</span>
              </div>
            </div>
          )}
          
          {/* Answer Content */}
          {!isLoading && answer && (
            <div>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-900">{displayAnswer}</div>
              </div>
              
              {/* Translation Options */}
              {translateService.isAvailable() && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Need this in another language?</p>
                    <div className="flex items-center space-x-2">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTranslate}
                        disabled={!selectedLanguage || isTranslating}
                      >
                        {isTranslating ? 'Translating...' : 'Translate'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 -mx-6 -mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onSave && (
              <Button variant="ghost" size="sm" onClick={onSave}>
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
            {onShare && (
              <Button variant="ghost" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
          </div>
          {onFollowUp && (
            <Button onClick={onFollowUp}>
              Ask Follow-up
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
