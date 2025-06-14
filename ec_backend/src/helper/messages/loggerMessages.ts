const loggerMessages = {
  exercise: {
    createExercise: {
      status_201: 'An exercise has just been created!',
      status_500:
        'An internal error occurred while creating the exercise. Check the error log for more information.',
    },
    deleteExercise: {
      status_200: 'An exercise has been deleted.',
      status_500:
        'An internal error occurred while deleting the exercise. Check the error log for more information.',
    },
    fetchExercises: {
      status_500:
        'An internal error occurred while creating the exercise. Check the error log for more information.',
    },
    fetchExerciseById: {
      status_500:
        'An internal error occurred while fetching the exercise. Check the error log for more information.',
    },
    fetchExercisesByQuery: {
      status_500:
        'An internal error occurred while fetching the exercise. Check the error log for more information.',
    },
    throwIfExerciseExists: {
      status_409:
        "There's another exercise with the same definitions. Check the error log for more details.",
    },
    updateExercise: {
      status_200: 'An exercise has been updated.',
      status_500:
        'An internal error occurred while updating the exercise. Check the error log for more information.',
    },
  },
  quiz: {
    createQuiz: {
      status_201: 'A quiz has been successfully created.',
      status_500:
        'An internal error occurred while creating the student. Check the error log for more information.',
    },
    deleteQuiz: {
      status_200: 'A quiz has been deleted.',
      status_500:
        'An internal error occurred while deleting the quiz. Check the error log for more information.',
    },
    fetchQuizzes: {
      status_500:
        'An internal error occurred while fetching the quizzes. Check the error log for more information.',
    },
    fetchQuizById: {
      status_500:
        'An internal error occurred while fetching the quiz. Check the error log for more information.',
    },
    fetchQuizzesByQuery: {
      status_500:
        'An internal error occurred while fetching the quizzes. Check the error log for more information.',
    },
    updateQuiz: {
      status_200: 'A quiz has been updated.',
      status_500:
        'An internal error occurred while updating the quiz. Check the error log for more information.',
    },
    throwIfQuizExists: {
      status_409:
        "There's another quiz with the same definitions. Check the error log for more details.",
      status_500:
        'An internal error occurred while checking if the quiz exists. Check the error log for more information.',
    },
  },
  student: {
    deleteStudent: {
      status_200: 'A student has been deleted.',
      status_500:
        'An internal error occurred while deleting the student. Check the error log for more information.',
    },
    fetchStudents: {
      status_500:
        'An internal error occurred while fetching the students. Check the error log for more information.',
    },
    fetchStudentById: {
      status_500:
        'An internal error occurred while fetching the student. Check the error log for more information.',
    },
    fetchStudentsByQuery: {
      status_500:
        'An internal error occurred while fetching the student. Check the error log for more information.',
    },
    registerStudent: {
      status_201: 'A new student has been successfully registered!',
      status_500:
        'An internal error occurred while registering the student. Check the error log for more information.',
    },
    throwIfStudentExists: {
      status_409:
        "There's another student with the same name in the database. Check the error log for more details.",
      status_500:
        'An internal error occurred while checking for possible existing students. Check the error log for more information.',
    },
    updateStudent: {
      status_200: 'A student register has been updated!',
      status_500:
        'An internal error occurred while fetching the student. Check the error log for more information.',
    },
  },
};

export default loggerMessages;
