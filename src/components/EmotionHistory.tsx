import React, { useEffect, useState } from "react";
import { getEmotionHistory } from "../utils/emotionHistory";

interface EmotionItem {
  emotion: string;
  confidence?: number;
  time?: string;
}

export default function EmotionHistory() {

  const [history, setHistory] = useState<EmotionItem[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {

    const data = getEmotionHistory();

    setHistory(data);

    const emotionCount: { [key: string]: number } = {};

    data.forEach((item) => {

      const emotion = item.emotion;

      if (!emotionCount[emotion]) emotionCount[emotion] = 0;

      emotionCount[emotion]++;

    });

    setCounts(emotionCount);

  }, []);

  const sorted = Object.entries(counts).sort(
    (a, b) => b[1] - a[1]
  );

  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-2">
        Mood History
      </h1>

      <p className="text-gray-400 mb-6">
        Your emotion journey over time
      </p>

      {/* Emotion Distribution */}

<div className="bg-gray-900 rounded-xl p-6 mb-8">

  <h2 className="text-lg font-semibold mb-4">
    Emotion Distribution
  </h2>

  {sorted.map(([emotion, count]) => {

    const width = (count / maxCount) * 100;
    const isTopEmotion = count === maxCount;

    return (

      <div key={emotion} className="mb-4">

        <div className="flex justify-between text-sm mb-1">

          <span
            className={
              isTopEmotion
                ? "text-green-400 font-bold"
                : "text-gray-300"
            }
          >
            {emotion}
          </span>

          <span className="text-gray-400">{count}</span>

        </div>

        <div className="w-full bg-gray-700 h-2 rounded">

          <div
            className={
              isTopEmotion
                ? "bg-green-500 h-2 rounded transition-all duration-500"
                : "bg-gray-400 h-2 rounded transition-all duration-500"
            }
            style={{
              width: `${width}%`
            }}
          />

        </div>

      </div>

    );

  })}

</div>
      {/* Recent Sessions */}

      <div className="bg-gray-900 rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Sessions
        </h2>

        {history.slice().reverse().map((item, i) => (

          <div
            key={i}
            className="border border-gray-700 rounded-lg p-3 mb-3 flex justify-between items-center"
          >

            <div>

              <strong className="text-white">
                {item.emotion}
              </strong>

              <div className="text-xs text-gray-400">

                {item.time
                  ? new Date(item.time).toLocaleString()
                  : "Unknown time"}

              </div>

            </div>

            {item.confidence && (
              <span className="text-green-400 font-semibold">
                {Math.round(item.confidence * 100)}%
              </span>
            )}

          </div>

        ))}

      </div>

    </div>

  );
}