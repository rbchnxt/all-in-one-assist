import { useState } from 'react';
import { speechService } from '@/lib/speech';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export function VoiceRecorder({ onTranscript, language = 'en-US' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartRecording = async () => {
    if (!speechService.isAvailable()) {
      setError('Speech recognition is not available in your browser');
      return;
    }

    setIsRecording(true);
    setError(null);
    speechService.setLanguage(language);

    try {
      const transcript = await speechService.startRecording();
      onTranscript(transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recording failed');
    } finally {
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    speechService.stopRecording();
    setIsRecording(false);
  };

  if (!speechService.isAvailable()) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">
          Voice recording is not available in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <Button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`h-24 w-24 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-pink-500'
              : 'bg-gradient-to-br from-red-500 to-pink-500'
          }`}
        >
          {isRecording ? (
            <Square className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {/* Pulse animation rings */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-1">
          {isRecording ? 'Listening...' : 'Click to start recording'}
        </p>
        <p className="text-sm text-gray-500">
          {isRecording ? 'Speak your question now' : 'Press and hold to record your question'}
        </p>
      </div>
      
      {/* Voice Visualization */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-1 h-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-500 rounded-full animate-pulse"
              style={{
                height: `${16 + Math.random() * 12}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
