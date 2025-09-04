import { copyToClipboard } from "../../../utils/validation.js";

const CommitResults = ({ messages }) => {
  const handleCopy = async (message) => {
    const success = await copyToClipboard(message);

    if (success) {
      // Could add toast notification here
      console.log("Copied to clipboard:", message);
    } else {
      console.error("Failed to copy message");
    }
  };

  const CopyIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-github-text mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-github-accent"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Generated Commit Messages
        </h2>

        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-github-bg-secondary 
                       border border-github-border rounded-md hover:border-github-border-muted transition-colors"
            >
              <code className="font-mono text-sm flex-1 mr-4 text-github-text break-all">
                {message}
              </code>
              <button
                onClick={() => handleCopy(message)}
                className="p-2 text-github-text-secondary hover:text-github-text hover:bg-github-border-muted 
                         rounded-md transition duration-200 flex items-center justify-center flex-shrink-0"
                title="Copy to clipboard"
              >
                <CopyIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommitResults;
