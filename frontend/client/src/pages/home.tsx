import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import FileUpload from "@/components/file-upload";
import ScoreDisplay from "@/components/score-display";
import KeywordsSection from "@/components/keywords-section";
import AnalyticsCharts from "@/components/analytics-charts";
import CareerTimeline from "@/components/career-timeline";
import ImprovementSuggestions from "@/components/improvement-suggestions";
import BeforeAfterExamples from "@/components/before-after-examples";
import { ThemeProvider } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeAnalysis } from "@shared/schema";

// Real backend integration - no more mock data!

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://resume-analyser-backend-ob3l.onrender.com/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data); // Check the structure in the console

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }
      setAnalysis(data); // Set analysis directly

      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${file.name}. Check your results below.`,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log("Export functionality triggered");
    toast({
      title: "Export Started",
      description: "Your resume analysis report is being prepared.",
    });
  };

  const handleReset = () => {
    setAnalysis(null);
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar onExport={handleExport} exportEnabled={!!analysis} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!analysis ? (
            // Hero Section with Upload
            <section className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                  Your career story,{" "}
                  <span className="text-chart-1">perfected.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                  Get instant, AI-powered feedback on your resume to land your
                  dream job. Upload your resume to begin.
                </p>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                className="mt-10"
              />
            </section>
          ) : (
            // Analysis Results
            <section className="space-y-16">
              {/* Headline */}
              <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {analysis.headline}
                </h1>
                <button
                  onClick={handleReset}
                  className="text-chart-1 hover:underline text-sm font-medium"
                  data-testid="button-analyze-new"
                >
                  Analyze a new resume
                </button>
              </div>

              {/* Scores */}
              <div className="space-y-8">
                <ScoreDisplay scores={analysis.scores} />
              </div>

              {/* Keywords and Analytics */}
              <div className="grid gap-12 xl:grid-cols-2">
                <div className="space-y-6">
                  <KeywordsSection keywords={analysis.keywords} />
                </div>
                <div className="space-y-6">
                  <AnalyticsCharts analytics={analysis.analytics} />
                </div>
              </div>

              {/* Career Timeline */}
              <div className="space-y-8">
                <CareerTimeline timeline={analysis.career_timeline} />
              </div>

              {/* Improvement Suggestions and Examples */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <ImprovementSuggestions
                    suggestions={analysis.improvement_suggestions}
                  />
                </div>
                <div className="space-y-6">
                  <BeforeAfterExamples
                    examples={analysis.before_and_after_examples}
                  />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
