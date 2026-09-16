import React from 'react';

interface Breakdown {
  keywordMatch: number;
  skillsMatch: number;
  structure: number;
  experience: number;
  semanticMatch: number;
}

interface ScoreBreakdownProps {
  breakdown?: Breakdown;
}

const maxScores = {
  keywordMatch: 25,
  skillsMatch: 25,
  structure: 15,
  experience: 15,
  semanticMatch: 20,
};

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  if (!breakdown) return null;

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Score Breakdown</h3>
      <div className="space-y-4">
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Keyword Match</span>
          <span className="text-blue-600 font-bold">{breakdown.keywordMatch} / {maxScores.keywordMatch}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(breakdown.keywordMatch / maxScores.keywordMatch) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Skills Match</span>
          <span className="text-blue-600 font-bold">{breakdown.skillsMatch} / {maxScores.skillsMatch}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(breakdown.skillsMatch / maxScores.skillsMatch) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Resume Structure</span>
          <span className="text-purple-600 font-bold">{breakdown.structure} / {maxScores.structure}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(breakdown.structure / maxScores.structure) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Experience Alignment</span>
          <span className="text-purple-600 font-bold">{breakdown.experience} / {maxScores.experience}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(breakdown.experience / maxScores.experience) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">AI Quality Evaluation</span>
          <span className="text-pink-600 font-bold">{breakdown.semanticMatch} / {maxScores.semanticMatch}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${(breakdown.semanticMatch / maxScores.semanticMatch) * 100}%` }}></div>
        </div>

      </div>
    </div>
  );
};

export default ScoreBreakdown;
