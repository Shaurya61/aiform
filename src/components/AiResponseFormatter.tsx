import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { marked } from 'marked';

const AIResponseFormatter = ({ response }: { response: string }) => {
  // Parse different sections from the response
  const sections = response
    .split(/(?=\b(?:ANALYSIS|EVIDENCE|DATA COVERAGE|CONFIDENCE|LIMITATIONS):)/)
    .filter(Boolean)
    .map(section => {
      const [title, ...content] = section.split(':');
      return {
        title: title.trim(),
        content: content.join(':').trim(),
      };
    });

  const getConfidenceColor = (confidence: string) => {
    const level = confidence.toLowerCase();
    if (level.includes('high')) return 'bg-green-100 text-green-800';
    if (level.includes('medium')) return 'bg-yellow-100 text-yellow-800';
    if (level.includes('low')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Convert markdown to HTML using marked
  const renderMarkdown = (markdown: string) => {
    const htmlContent = marked(markdown);
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  // Update renderEvidence to handle markdown in the evidence content
  const renderEvidence = (content: string) => {
    console.log('Evidence Content:', content); // Debugging step to see the content structure
  
    // Replace encoded quotes with standard quotes in case they're present in the content
    const decodedContent = content.replace(/&quot;/g, '"');
  
    // Updated regex to handle both encoded and standard quotes
    const quoteRegex = /"(.*?)"\s*-?\s*([a-zA-Z0-9 ]*(?:\(\d{4}-\d{2}-\d{2}\))?)/g;
    let match;
    const quoteItems = [];
  
    // Use the regex to extract each quote and its associated author if available
    while ((match = quoteRegex.exec(decodedContent)) !== null) {
      const quoteText = match[1];
      const author = match[2] ? match[2].trim() : 'Unknown Author'; // Fallback to 'Unknown Author' if not present
      quoteItems.push({ quoteText, author });
    }
  
    // Display a message if no quotes are found, for debugging purposes
    if (quoteItems.length === 0) {
      return <p className="text-gray-500">No evidence available or evidence format is incorrect.</p>;
    }
  
    // Render the evidence items
    return quoteItems.map((item, index) => (
      <div key={index} className="flex items-start space-x-2 mb-2">
        <Quote className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
        <div className="text-gray-600">
          <p className="font-semibold">&quot;{item.quoteText}&quot;</p>
          <span className="text-sm text-gray-500">- {item.author}</span>
        </div>
      </div>
    ));
  };
  

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        switch (section.title) {
          case 'ANALYSIS':
            return (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Key Findings
                  </h3>
                  {renderMarkdown(section.content)}
                </CardContent>
              </Card>
            );

          case 'EVIDENCE':
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Supporting Evidence
                  </h3>
                  <div className="pl-2">{renderEvidence(section.content)}</div>
                </CardContent>
              </Card>
            );

          case 'CONFIDENCE':
            return (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Confidence Level:
                </span>
                <Badge className={`${getConfidenceColor(section.content)}`}>
                  {section.content.replace(/[#*]/g, '')}
                </Badge>
              </div>
            );

          case 'DATA COVERAGE':
            return (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Data Coverage
                  </h3>
                  {renderMarkdown(section.content)}
                </CardContent>
              </Card>
            );

          case 'LIMITATIONS':
            return (
              <div key={index} className="text-sm text-gray-500 italic">
                <span className="font-medium">Note on limitations: </span>
                {renderMarkdown(section.content)}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default AIResponseFormatter;