import React from 'react';

interface RecipeUrlInputProps {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmitUrl: () => void;
  error?: string | null
}

const RecipeUrlInput: React.FC<RecipeUrlInputProps> = ({ error, url, onUrlChange, onSubmitUrl }) => {
  return (
    <div className="w-full">
      {error && <span>{error}</span>}
      <div className="flex w-full justify-center">
        <input
          name="recipe-url-input"
          className="w-11/12 p-1 border border-gray-300"
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter recipe URL"
        />
        <button className="ml-3 w-1/12 border border border-gray-300 p-3" onClick={onSubmitUrl}>Get Ingredients</button>
      </div>
    </div>

  );
};


export default RecipeUrlInput;
