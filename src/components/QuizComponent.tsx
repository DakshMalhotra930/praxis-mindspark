import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Question {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizComponentProps {
  questions: Question[];
  onComplete?: () => void;
}

export const QuizComponent = ({ questions, onComplete }: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      onComplete?.();
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === questions[index]?.correct_answer ? score + 1 : score;
    }, 0);
  };

  if (!questions.length) {
    return (
      <Card className="academic-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No questions available for this quiz.</p>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <Card className="academic-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Completed! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text-primary mb-2">
              {score}/{questions.length}
            </div>
            <p className="text-lg text-muted-foreground">
              {percentage}% Score
            </p>
          </div>

          <Progress value={percentage} className="h-4" />

          <div className="grid gap-4">
            <div className="text-center space-y-2">
              {percentage >= 80 && (
                <Badge className="bg-success text-white">Excellent! 🌟</Badge>
              )}
              {percentage >= 60 && percentage < 80 && (
                <Badge className="bg-primary">Good Work! 👍</Badge>
              )}
              {percentage < 60 && (
                <Badge variant="outline">Keep Practicing! 💪</Badge>
              )}
              
              <p className="text-sm text-muted-foreground">
                {percentage >= 80 && "Outstanding performance! You've mastered this topic."}
                {percentage >= 60 && percentage < 80 && "Great job! Review the explanations to improve further."}
                {percentage < 60 && "Don't worry! Practice makes perfect. Review the concepts and try again."}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRestartQuiz}
                variant="outline"
                className="hover-glow"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="font-semibold text-center">Question Review</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isQuestionCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-shrink-0">
                      {isQuestionCorrect ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-error" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Question {index + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {isQuestionCorrect ? 'Correct' : `Wrong - Correct answer: ${question.options[question.correct_answer]}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="text-lg">
            <MarkdownRenderer content={currentQuestion.question} />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correct_answer;
              
              let buttonVariant: "outline" | "default" | "destructive" = "outline";
              let className = "justify-start text-left h-auto p-4 hover-glow";
              
              if (showExplanation) {
                if (isCorrectOption) {
                  className += " border-success bg-success/10 hover:bg-success/10";
                } else if (isSelected && !isCorrectOption) {
                  className += " border-error bg-error/10 hover:bg-error/10";
                }
              } else if (isSelected) {
                buttonVariant = "default";
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={className}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="flex-1 text-left">{option}</span>
                    {showExplanation && isCorrectOption && (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                    {showExplanation && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-error flex-shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-error" />
                )}
                <span className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <MarkdownRenderer content={currentQuestion.explanation} />
              </div>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNextQuestion}
                className="hover-glow"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'Complete Quiz'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};