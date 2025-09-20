import { createContext, useContext, useReducer, useCallback } from 'react';
import { quizService } from '../services/quizService';
import toast from 'react-hot-toast';

const QuizContext = createContext(null);

// Quiz actions
const QUIZ_ACTIONS = {
  FETCH_QUIZZES_START: 'FETCH_QUIZZES_START',
  FETCH_QUIZZES_SUCCESS: 'FETCH_QUIZZES_SUCCESS',
  FETCH_QUIZZES_FAILURE: 'FETCH_QUIZZES_FAILURE',
  
  START_QUIZ_START: 'START_QUIZ_START',
  START_QUIZ_SUCCESS: 'START_QUIZ_SUCCESS',
  START_QUIZ_FAILURE: 'START_QUIZ_FAILURE',
  
  SUBMIT_ANSWER_START: 'SUBMIT_ANSWER_START',
  SUBMIT_ANSWER_SUCCESS: 'SUBMIT_ANSWER_SUCCESS',
  SUBMIT_ANSWER_FAILURE: 'SUBMIT_ANSWER_FAILURE',
  
  FINISH_QUIZ_START: 'FINISH_QUIZ_START',
  FINISH_QUIZ_SUCCESS: 'FINISH_QUIZ_SUCCESS',
  FINISH_QUIZ_FAILURE: 'FINISH_QUIZ_FAILURE',
  
  FETCH_RESULTS_SUCCESS: 'FETCH_RESULTS_SUCCESS',
  
  RESET_QUIZ_STATE: 'RESET_QUIZ_STATE',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
};

// Initial state
const initialState = {
  // Quiz list
  quizzes: [],
  loadingQuizzes: false,
  
  // Current quiz session
  currentQuiz: null,
  currentQuestion: 0,
  answers: {},
  quizResult: null,
  
  // User results
  userResults: [],
  
  // Loading states
  loading: false,
  submittingAnswer: false,
};

// Reducer
function quizReducer(state, action) {
  switch (action.type) {
    case QUIZ_ACTIONS.FETCH_QUIZZES_START:
      return {
        ...state,
        loadingQuizzes: true,
      };

    case QUIZ_ACTIONS.FETCH_QUIZZES_SUCCESS:
      return {
        ...state,
        quizzes: action.payload,
        loadingQuizzes: false,
      };

    case QUIZ_ACTIONS.FETCH_QUIZZES_FAILURE:
      return {
        ...state,
        loadingQuizzes: false,
      };

    case QUIZ_ACTIONS.START_QUIZ_START:
      return {
        ...state,
        loading: true,
      };

    case QUIZ_ACTIONS.START_QUIZ_SUCCESS:
      return {
        ...state,
        currentQuiz: action.payload.quiz,
        currentQuestion: 0,
        answers: {},
        loading: false,
      };

    case QUIZ_ACTIONS.START_QUIZ_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case QUIZ_ACTIONS.SUBMIT_ANSWER_START:
      return {
        ...state,
        submittingAnswer: true,
      };

    case QUIZ_ACTIONS.SUBMIT_ANSWER_SUCCESS:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: {
            optionId: action.payload.optionId,
            isCorrect: action.payload.isCorrect,
            submittedAt: action.payload.submittedAt,
          },
        },
        submittingAnswer: false,
      };

    case QUIZ_ACTIONS.SUBMIT_ANSWER_FAILURE:
      return {
        ...state,
        submittingAnswer: false,
      };

    case QUIZ_ACTIONS.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload,
      };

    case QUIZ_ACTIONS.FINISH_QUIZ_SUCCESS:
      return {
        ...state,
        quizResult: action.payload,
        currentQuiz: null,
        currentQuestion: 0,
        answers: {},
      };

    case QUIZ_ACTIONS.FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        userResults: action.payload,
      };

    case QUIZ_ACTIONS.RESET_QUIZ_STATE:
      return {
        ...state,
        currentQuiz: null,
        currentQuestion: 0,
        answers: {},
        quizResult: null,
      };

    default:
      return state;
  }
}

// Context Provider
export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Bungkus fungsi-fungsi dengan useCallback untuk menstabilkan pemanggilan
  const fetchQuizzes = useCallback(async () => {
    try {
      dispatch({ type: QUIZ_ACTIONS.FETCH_QUIZZES_START });
      const response = await quizService.getPublicQuizzes();
      dispatch({
        type: QUIZ_ACTIONS.FETCH_QUIZZES_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({ type: QUIZ_ACTIONS.FETCH_QUIZZES_FAILURE });
    }
  }, [dispatch]);

  const startQuiz = useCallback(async (quizId) => {
    try {
      dispatch({ type: QUIZ_ACTIONS.START_QUIZ_START });
      const response = await quizService.startQuiz(quizId);
      dispatch({
        type: QUIZ_ACTIONS.START_QUIZ_SUCCESS,
        payload: response.data,
      });
      toast.success('Quiz started!');
      return { success: true };
    } catch (error) {
      dispatch({ type: QUIZ_ACTIONS.START_QUIZ_FAILURE });
      const message = error.response?.data?.message || 'Failed to start quiz';
      toast.error(message);
      return { success: false, message };
    }
  }, [dispatch]);

  const submitAnswer = useCallback(async (questionId, optionId) => {
    try {
      dispatch({ type: QUIZ_ACTIONS.SUBMIT_ANSWER_START });
      const response = await quizService.submitAnswer(questionId, optionId);
      dispatch({
        type: QUIZ_ACTIONS.SUBMIT_ANSWER_SUCCESS,
        payload: {
          questionId,
          optionId,
          isCorrect: response.data.is_correct,
          submittedAt: response.data.submitted_at,
        },
      });
      return { success: true, isCorrect: response.data.is_correct };
    } catch (error) {
      dispatch({ type: QUIZ_ACTIONS.SUBMIT_ANSWER_FAILURE });
      const message = error.response?.data?.message || 'Failed to submit answer';
      toast.error(message);
      return { success: false, message };
    }
  }, [dispatch]);

  const finishQuiz = useCallback(async (quizId) => {
    try {
      dispatch({ type: QUIZ_ACTIONS.FINISH_QUIZ_START });
      const response = await quizService.finishQuiz(quizId);
      dispatch({
        type: QUIZ_ACTIONS.FINISH_QUIZ_SUCCESS,
        payload: response.data,
      });
      toast.success('Quiz completed!');
      return { success: true, result: response.data };
    } catch (error) {
      dispatch({ type: QUIZ_ACTIONS.FINISH_QUIZ_FAILURE });
      const message = error.response?.data?.message || 'Failed to finish quiz';
      toast.error(message);
      return { success: false, message };
    }
  }, [dispatch]);

  const fetchUserResults = useCallback(async () => {
    try {
      const response = await quizService.getUserResults();
      dispatch({
        type: QUIZ_ACTIONS.FETCH_RESULTS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  }, [dispatch]);

  const nextQuestion = useCallback(() => {
    if (state.currentQuestion < state.currentQuiz.questions.length - 1) {
      dispatch({
        type: QUIZ_ACTIONS.SET_CURRENT_QUESTION,
        payload: state.currentQuestion + 1,
      });
    }
  }, [state.currentQuestion, state.currentQuiz]);

  const previousQuestion = useCallback(() => {
    if (state.currentQuestion > 0) {
      dispatch({
        type: QUIZ_ACTIONS.SET_CURRENT_QUESTION,
        payload: state.currentQuestion - 1,
      });
    }
  }, [state.currentQuestion]);

  const goToQuestion = useCallback((questionIndex) => {
    dispatch({
      type: QUIZ_ACTIONS.SET_CURRENT_QUESTION,
      payload: questionIndex,
    });
  }, [dispatch]);

  const resetQuizState = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.RESET_QUIZ_STATE });
  }, [dispatch]);

  // Helper functions
  const getCurrentQuestion = () => {
    if (!state.currentQuiz || !state.currentQuiz.questions) return null;
    return state.currentQuiz.questions[state.currentQuestion];
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(state.answers).length;
  };

  const isQuestionAnswered = (questionIndex) => {
    const question = state.currentQuiz?.questions[questionIndex];
    return question && state.answers[question.id];
  };

  const canFinishQuiz = () => {
    const totalQuestions = state.currentQuiz?.questions?.length || 0;
    const answeredQuestions = getAnsweredQuestionsCount();
    return answeredQuestions === totalQuestions && answeredQuestions > 0;
  };

  const value = {
    ...state,
    fetchQuizzes,
    startQuiz,
    submitAnswer,
    finishQuiz,
    fetchUserResults,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    resetQuizState,
    getCurrentQuestion,
    getAnsweredQuestionsCount,
    isQuestionAnswered,
    canFinishQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

// Custom hook
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}