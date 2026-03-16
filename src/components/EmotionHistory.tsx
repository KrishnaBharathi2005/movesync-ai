import React, { useEffect, useState } from "react";
import { getEmotionHistory } from "../utils/emotionHistory";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

interface EmotionItem {
  emotion: string;
  confidence?: number;
  time?: string;
}

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#14b8a6"
];

export default function EmotionHistory() {

  const [history, setHistory] = useState<EmotionItem[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {

    const data = getEmotionHistory();

    setHistory(data);

    const counts: { [key: string]: number } = {};

    data.forEach((item) => {

      const emotion = item.emotion;

      if (!counts[emotion]) counts[emotion] = 0;

      counts[emotion]++;

    });

    const formatted = Object.entries(counts).map(([emotion, count]) => ({
      emotion,
      count
    }));

    setChartData(formatted);

  }, []);

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-2">
        Mood History
      </h1>

      <p className="text-gray-400 mb-6">
        Your emotion journey over time
      </p>

      <div className="grid grid-cols-2 gap-6">

        {/* PIE CHART */}

        <div className="bg-gray-900 rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            Emotion Distribution
          </h2>

          <ResponsiveContainer width="100%" height={250}>

            <PieChart>

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="emotion"
                outerRadius={90}
                label
              >

                {chartData.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* BAR CHART */}

        <div className="bg-gray-900 rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            Emotion Intensity
          </h2>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={chartData}>

              <XAxis dataKey="emotion" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
              >

                {chartData.map((entry, index) => (

                  <Cell
                    key={`bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT SESSIONS */}

      <div className="bg-gray-900 rounded-xl p-6 mt-8">

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