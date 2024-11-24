import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ExternalLink } from 'lucide-react';

const WordAbbreviator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const examples = [
    { original: 'kubernetes', abbreviated: 'k8s' },
    { original: 'internationalization', abbreviated: 'i18n' },
    { original: 'Andreessen Horowitz', abbreviated: 'a16z' },
    { original: 'localization', abbreviated: 'l10n' },
    { original: 'accessibility', abbreviated: 'a11y' },
    { original: 'authorization', abbreviated: 'a11n' },
    { original: 'authentication', abbreviated: 'a12n' },
    { original: 'optimization', abbreviated: 'o11n' }
  ];

  const abbreviateWord = useCallback((text) => {
    setError('');

    if (!text.trim()) {
      setError('Please enter text');
      return null;
    }

    const specialCases = {
      'andreessen horowitz': 'a16z',
      'a16z': 'a16z'
    };

    const cleanText = text.toLowerCase().trim();
    
    if (specialCases[cleanText]) {
      return specialCases[cleanText];
    }

    if (!cleanText.includes(' ')) {
      if (cleanText.length <= 3) return cleanText;
      
      const firstChar = cleanText[0];
      const lastChar = cleanText[cleanText.length - 1];
      const middleLength = cleanText.length - 2;
      
      return `${firstChar}${middleLength}${lastChar}`;
    }

    const words = cleanText.split(' ');
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    const firstChar = firstWord[0];
    const lastChar = lastWord[lastWord.length - 1];
    const totalLength = cleanText.replace(/\s/g, '').length - 2;
    
    return `${firstChar}${totalLength}${lastChar}`;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const abbreviated = abbreviateWord(input);
    if (abbreviated) {
      setResult(abbreviated);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue);
    setError('');
    
    if (newValue.trim()) {
      const abbreviated = abbreviateWord(newValue);
      if (abbreviated) {
        setResult(abbreviated);
      }
    } else {
      setResult('');
    }
  };

  const handleExampleClick = (example) => {
    setInput(example.original);
    const abbreviated = abbreviateWord(example.original);
    if (abbreviated) {
      setResult(abbreviated);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>Numeronym Generator</span>
          <a 
            href="https://en.m.wikipedia.org/wiki/Numeronym" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            Learn more <ExternalLink size={16} />
          </a>
        </CardTitle>
        <CardDescription>
          Convert words into numeronyms (e.g., kubernetes → k8s, internationalization → i18n)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Enter text..."
              className="flex-1"
            />
            <Button 
              type="submit"
              disabled={!input.trim()}
            >
              Convert
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {result && (
            <div className="text-center p-4 bg-secondary rounded-lg">
              <span className="text-2xl font-mono">
                {input.toLowerCase().trim()} → {result}
              </span>
            </div>
          )}
        </form>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Click an example to try:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <Badge 
                key={example.original} 
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => handleExampleClick(example)}
              >
                {example.original} → {example.abbreviated}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordAbbreviator;
