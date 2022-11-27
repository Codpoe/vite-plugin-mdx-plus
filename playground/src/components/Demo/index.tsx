import { useState } from 'react';
import './index.css';

export interface DemoProps {
  code: string;
  codeHtml: string;
  language?: string;
  children?: React.ReactNode;
}

export const Demo: React.FC<DemoProps> = ({ code, codeHtml, children }) => {
  const [showCode, setShowCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleActionBarClick = (ev: React.SyntheticEvent) => {
    if (ev.target !== ev.currentTarget) {
      return;
    }
    setShowCode(prev => !prev);
  };

  const handleCopy = async () => {
    if (copySuccess) {
      return;
    }

    await navigator.clipboard.writeText(code);

    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  return (
    <div className="my-5 border border-c-border-1 rounded-md divide-y divide-c-border-1 overflow-hidden">
      <div className="px-5 py-4 not-prose">{children}</div>
      <div
        className="flex items-center px-2 h-8 cursor-pointer"
        onClick={handleActionBarClick}
      >
        <button
          className={`btn-text h-full px-3 ${showCode ? 'text-c-brand' : ''}`}
          onClick={() => setShowCode(prev => !prev)}
        >
          Code
        </button>
        <button
          className={`btn-text h-full px-3 ${
            copySuccess ? 'text-c-brand' : ''
          }`}
          onClick={handleCopy}
        >
          {copySuccess ? 'Copied' : 'Copy'}
        </button>
      </div>
      {showCode && (
        <div
          className="demo-code-wrapper"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        ></div>
      )}
    </div>
  );
};
