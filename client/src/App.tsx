
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Record the click event
      await trpc.recordClick.mutate({ button_label: 'Click Here' });
      setClickCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to record click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-indigo-200 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">🎯 Click Counter</h1>
            <p className="text-gray-600">Press the button below to increment the counter</p>
          </div>
          
          <div className="py-4">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {clickCount}
            </div>
            <p className="text-sm text-gray-500">
              {clickCount === 0 ? 'No clicks yet!' : 
               clickCount === 1 ? '1 click recorded' : 
               `${clickCount} clicks recorded`}
            </p>
          </div>

          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Recording...
              </div>
            ) : (
              '🔘 Click Here'
            )}
          </Button>

          <div className="text-xs text-gray-400 mt-4">
            Each click is recorded and counted locally
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
