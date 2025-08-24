import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 30, shouldAnimate = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, shouldAnimate]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className="whitespace-pre-wrap text-gray-700">
      {displayedText}
      {!isComplete && shouldAnimate && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
};

const BugInfo = ({ bugInfo, onBugClick, isNew = false }) => {
  // Handle raw text response from AI
  if (typeof bugInfo === 'string') {
    return (
      <div className="bug-info p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2 text-sm">
        <p className="font-medium mb-2">AI Analysis:</p>
        <TypewriterText text={bugInfo} speed={25} shouldAnimate={isNew} />
      </div>
    );
  }

  // Handle legacy rawText format
  if (bugInfo?.rawText) {
    return (
      <div className="bug-info p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2 text-sm">
        <p className="font-medium mb-2">AI Analysis:</p>
        <TypewriterText text={bugInfo.rawText} speed={25} shouldAnimate={isNew} />
      </div>
    );
  }

  // Handle structured bug data (no typewriter for structured data)
  const extractBugs = (bugInfo) => {
    if (bugInfo.aiResponse) {
      return Array.isArray(bugInfo.aiResponse) ? bugInfo.aiResponse : [bugInfo.aiResponse];
    }
    return Array.isArray(bugInfo) ? bugInfo : [bugInfo];
  };

  const bugs = extractBugs(bugInfo);

  return (
    <div className="bug-info p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
      {bugs.map((bug, index) => (
        <BugItem key={index} bug={bug} onBugClick={onBugClick} />
      ))}
    </div>
  );
};

const BugItem = ({ bug, onBugClick }) => {
  const handleClick = () => {
    if (bug.id && onBugClick) {
      onBugClick(bug.id);
    }
  };

  return (
    <div
      className="bug-item mb-3 last:mb-0 cursor-pointer hover:bg-gray-100 p-2 rounded"
      onClick={handleClick}
    >
      <p className="font-medium text-sm">{bug.title || 'Bug Details'}</p>
      
      <div className="bug-details text-xs space-y-1 mt-1">
        <BugDetail label="ID" value={bug.id} />
        <BugDetail label="Product" value={bug.product} />
        <BugDetail label="Type" value={bug.type} />
        <BugDetail label="Status" value={bug.status} />
        <BugDetail label="Resolution" value={bug.resolution} />
        
        {bug.description && (
          <div className="mt-2">
            <span className="font-medium block">Description:</span>
            <p className="mt-1 whitespace-pre-wrap">{bug.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BugDetail = ({ label, value }) => (
  value && (
    <div className="flex">
      <span className="font-medium w-24">{label}:</span>
      <span>{value}</span>
    </div>
  )
);

export default BugInfo;