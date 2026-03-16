import React from "react";
import { useApp } from "@/context/AppContext";
import { EMOTION_EMOJIS, type Emotion } from "@/lib/constants";

const EMOTION_BAR_COLORS: Record<Emotion, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  fear: "bg-purple-500",
  disgust: "bg-yellow-500",
  surprise: "bg-pink-500",
  neutral: "bg-gray-500"
};

const EMOTION_DOT_COLORS: Record<Emotion, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  fear: "bg-purple-500",
  disgust: "bg-yellow-500",
  surprise: "bg-pink-500",
  neutral: "bg-gray-500"
};

export function HistoryPage() {

  const { moodHistory } = useApp();

  const emotionCounts: Record<string, number> = {};

  moodHistory.forEach((m) => {
    emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(emotionCounts), 1);

  return (

    <div className="animate-fade-in">

      <div className="mb-8">

        <h1 className="font-display text-3xl font-extrabold">
          Mood <span className="text-primary">History</span>
        </h1>

        <p className="text-muted-foreground mt-1.5 text-sm">
          Your emotion journey over time
        </p>

      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* Emotion Distribution */}

        <div className="bg-card border border-border rounded-2xl p-6">

          <h3 className="font-display font-bold mb-4">
            Emotion Distribution
          </h3>

          {Object.keys(emotionCounts).length === 0 ? (

            <div className="text-center py-12 text-muted-foreground">

              <div className="text-5xl mb-4">📈</div>

              <div>Stats will appear here</div>

            </div>

          ) : (

            <div className="space-y-3">

              {Object.entries(emotionCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([emotion, count]) => (

                  <div key={emotion} className="flex items-center gap-3">

                    <span className="w-16 text-xs text-muted-foreground text-right capitalize">
                      {emotion}
                    </span>

                    <div className="flex-1 h-2.5 bg-foreground/5 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          EMOTION_BAR_COLORS[emotion as Emotion]
                        }`}
                        style={{
                          width: `${Math.round((count / maxCount) * 100)}%`
                        }}
                      />

                    </div>

                    <span className="w-8 text-xs text-muted-foreground text-right">
                      {count}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </div>

        {/* Recent Sessions */}

        <div className="bg-card border border-border rounded-2xl p-6">

          <h3 className="font-display font-bold mb-4">
            Recent Sessions
          </h3>

          <div className="max-h-[300px] overflow-y-auto">

            {moodHistory.length === 0 ? (

              <div className="text-center py-12 text-muted-foreground">

                <div className="text-5xl mb-4">📊</div>

                <div>No history yet — capture your mood!</div>

              </div>

            ) : (

              <div className="space-y-3">

                {moodHistory.slice(0, 50).map((entry) => (

                  <div
                    key={entry.id}
                    className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-primary/20 transition-colors"
                  >

                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        EMOTION_DOT_COLORS[entry.emotion]
                      }`}
                    />

                    <div className="flex-1">

                      <div className="font-display font-bold text-sm capitalize">

                        {EMOTION_EMOJIS[entry.emotion]} {entry.emotion}

                      </div>

                      <div className="text-xs text-muted-foreground mt-0.5">

                        {new Date(entry.timestamp).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}

                        {" · Age: "}
                        {entry.ageGroup}

                      </div>

                    </div>

                    <div className="text-xs text-primary font-semibold whitespace-nowrap">

                      {Math.round(entry.confidence)}%

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}