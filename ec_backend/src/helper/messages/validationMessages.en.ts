const validationMessages_EN = {
  answeredExercise: {
    saveAnswerDTO: {
      exerciseId: {
        isNotEmpty: 'The exerciseId field must not be empty.',
        isInt: 'The exerciseId must be an INT.',
      },
      studentId: {
        isNotEmpty: 'The studentId field must not be empty.',
        isUUID: 'The studentId field is not a valid UUID.',
      },
      quizId: {
        isUUID: 'The quizId is not a valid UUID.',
      },
      isRetry: {
        isBoolean: 'The isRetry field must be a boolean.',
      },
      selectedAnswers: {
        isArray: 'The selectedAnswers field must be an array of items.',
      },
      textAnswer: {
        isString: 'The textAnswer field must be a string.',
      },
      audioUrl: {
        isUrl: 'The audioUrl field is not a valid URL.',
      },
      isCorrectAnswer: {
        isBoolean: 'The isCorrectAnswer field must be a boolean.',
      },
      feedback: {
        isString: 'The feedback must be a string.',
      },
      elapsedTime: {
        isNotEmpty: 'The elapsedTime field must not be empty.',
        isInt: 'The elapsedTime field must be a value in miliseconds.',
      },
    },
  },
  exercises: {
    createExerciseDTO: {
      type: {
        isNotEmpty: 'The type field cannot be empty.',
        isIn: 'The type is invalid.',
      },
      description: {
        isNotEmpty: 'The description field cannot be empty.',
        isString: 'The description must be a string',
      },
      contentUrl: {
        isUrl: 'The contentUrl field must be a valid URL.',
      },
      level: {
        isNotEmpty: 'The level field cannot be empty.',
        isIn: 'The level is invalid.',
      },
      difficulty: {
        isNotEmpty: 'The difficulty field cannot be empty.',
        isIn: 'The difficulty is invalid.',
      },
      options: {
        isArray: 'The options field must be an array of items.',
      },
      correctAnswer: {
        isNotEmpty: 'The correctAnswer field cannot be empty.',
        isArray: 'The correctAnswer field must be an array of items.',
      },
    },
    fetchExercisesByQuery: {
      quizId: {
        isUUID: 'The quizId value is invalid.',
      },
    },
  },
  quizzes: {
    addOrRemoveExerciseDTO: {
      quizId: {
        isNotEmpty: 'The quizId field must not be empty.',
        isUUID: 'The quizId field is not a valid UUID.',
      },
      exerciseId: {
        isNotEmpty: 'The quizId field must not be empty.',
        isInt: 'The exerciseId must be a number.',
      },
    },
    createQuizDTO: {
      isTest: {
        isBoolean: 'The isTest field must be a boolean.',
      },
      title: {
        isNotEmpty: 'The title field must not be empty.',
        isString: 'The title field must be a string.',
      },
      description: {
        isNotEmpty: 'The description field must not be empty.',
        isString: 'The difficulty field must be a string.',
      },
      imageUrl: {
        isUrl: 'The imageUrl field must be a valid URL.',
      },
      level: {
        isIn: 'The level is invalid.',
      },
      difficulty: {
        isIn: 'The difficulty is invalid.',
        isNotEmpty: 'The difficulty field must not be empty.',
      },
    },
    fetchQuizzesByQueryDTO: {
      level: {
        isIn: 'The level is invalid.',
      },
      difficulty: {
        isIn: 'The difficulty is invalid.',
      },
    },
  },
  students: {
    registerStudentDTO: {
      name: {
        isNotEmpty: 'The name field cannot be empty.',
        isString: 'The name field must be a string.',
      },
      age: {
        isNotEmpty: 'The age field cannot be empty.',
        isNumber: 'The age field must be a number.',
      },
      birthdate: {
        isNotEmpty: 'The birthdate field cannot be empty.',
        isDate: 'The birthdate field must be a valid date.',
      },
      city: {
        isNotEmpty: 'The city field cannot be empty.',
        isString: 'The city field must be a string.',
      },
      state: {
        isNotEmpty: 'The state field cannot be empty.',
        isString: 'The state field must be a string.',
      },
      country: {
        isNotEmpty: 'The country field cannot be empty.',
        isString: 'The country field must be a string.',
      },
    },
  },
};

export default validationMessages_EN;
