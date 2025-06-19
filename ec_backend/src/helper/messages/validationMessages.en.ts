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
      fileId: {
        isUrl: 'The fileId field is not a valid URL.',
      },
      isCorrectAnswer: {
        isBoolean: 'The isCorrectAnswer field must be a boolean.',
      },
      feedback: {
        isString: 'The feedback must be a string.',
      },
      elapsedTime: {
        isNotEmpty: 'The elapsedTime field must not be empty.',
        isInt: 'The elapsedTime field must be a value in seconds.',
      },
    },
    addFeedback: {
      feedback: {
        isNotEmpty: 'The feedback field must not be empty.',
        isString: 'The feedback field must be a string.',
      },
    },
  },
  answeredQuiz: {
    addFeedback: {
      feedback: {
        isNotEmpty: 'The feedback field must not be empty.',
        isString: 'The feedback field must be a string.',
      },
    },
    quizId: {
      isNotEmpty: 'The quizId field must not be empty.',
      isUUID: 'The quizId field must be a valid UUID.',
    },
    studentId: {
      isNotEmpty: 'The studentId field must not be empty.',
      isUUID: 'The studentId field must be a valid UUID.',
    },
    score: {
      isNotEmpty: 'The score field must not be empty.',
      isInt: 'The score field must be a number.',
    },
    feedback: {
      isString: 'The feedback field must be a string.',
    },
    elapsedTime: {
      isNotEmpty: 'The elapsedTime field must not be empty.',
      isInt: 'The elapsedTime field must be a number in seconds.',
    },
    isRetry: {
      isBoolean: 'The isRetry field must be a boolean.',
    },
  },
  chapter: {
    generateChapterDTO: {
      name: {
        isNotEmpty: 'The name field must not be empty.',
        isString: 'The name field must be a string.',
      },
      description: {
        isNotEmpty: 'The description field must not be empty.',
        isString: 'The description field must be a string.',
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
      fileId: {
        isUrl: 'The fileId field must be a valid URL.',
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
      quizId: {
        isUUID: 'The quizId is not valid.',
      },
    },
    fetchExercisesByQuery: {
      quizId: {
        isUUID: 'The quizId value is invalid.',
      },
    },
  },
  file: {
    generateFileDTO: {
      name: {
        isNotEmpty: 'The name field must not be empty.',
        isString: 'The name field must be a string.',
      },
      type: {
        isNotEmpty: 'The type field must not be empty.',
        isIn: 'The type is invalid.',
      },
      url: {
        isNotEmpty: 'The url field must not be empty.',
        isUrl: 'The url field must be a valid URL.',
      },
      size: {
        isNotEmpty: 'The size field must not be empty.',
        isInt: 'The size field must be a number in MB',
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
      fileId: {
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
      observations: {
        isString: 'The observations field must be a string.',
      },
    },
  },
  tag: {
    addOrRemoveTagDTO: {
      contentType: {
        isNotEmpty: 'The contentType field must not be empty.',
        isIn: 'The contentType field is invalid.',
      },
      tagId: {
        isNotEmpty: 'The tagId field must not be empty.',
        isInt: 'The tagId field must be a number.',
      },
      exerciseId: {
        isNotEmpty: 'The exerciseId field must not be empty.',
        isInt: 'The exerciseId field must be a number.',
      },
      quizId: {
        isNotEmpty: 'The quizId field must not be empty.',
        isUUID: 'The quizId field must be a UUID.',
      },
      unitId: {
        isNotEmpty: 'The unitId field must not be empty.',
        isInt: 'The unitId field must be a number.',
      },
      videoId: {
        isNotEmpty: 'The videoId field must not be empty.',
        isUUID: 'The videoId field must be a UUID.',
      },
    },
    createTagDTO: {
      title: {
        isNotEmpty: 'The title field cannot be empty.',
        isString: 'The title field must be a string.',
      },
    },
    fetchContentByTag: {
      title: {
        isNotEmpty: 'The title field cannot be empty.',
        isString: 'The title field must be a string.',
      },
      contentType: {
        isIn: 'The contentType field is invalid.',
      },
    },
  },
  user: {
    registerUserDTO: {
      name: {
        isNotEmpty: 'The name field must not be empty.',
        isString: 'The name field must be a string.',
      },
      bio: {
        isString: 'The bio field must be a string.',
      },
      city: {
        isString: 'The city field must be a string.',
      },
      state: {
        isString: 'The state field must be a string.',
      },
      country: {
        isString: 'The country field must be a string.',
      },
      avatarUrl: {
        isUrl: 'The avatarUrl field must be filled with a valid URL.',
      },
      email: {
        isNotEmpty: 'The email field must not be empty.',
        isEmail:
          'The email field must be a valid email (example: user@mail.com)',
      },
      password: {
        isNotEmpty: 'The password field must not be empty.',
        isStrongPassword:
          'The password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol.',
      },
    },
    updateUserDTO: {
      name: {
        isString: 'The name field must be a string.',
      },
      bio: {
        isString: 'The bio field must be a string.',
      },
      city: {
        isString: 'The city field must be a string.',
      },
      state: {
        isString: 'The state field must be a string.',
      },
      country: {
        isString: 'The country field must be a string.',
      },
      avatarUrl: {
        isUrl: 'The avatarUrl field must be filled with a valid URL.',
      },
    },
  },
  video: {
    generateVideoDTO: {
      title: {
        isNotEmpty: 'The title field must not be empty.',
        isString: 'The title field must be a string.',
      },
      description: {
        isString: 'The description field must be a string.',
      },
      url: {
        isNotEmpty: 'The url field must not be empty.',
        isUrl: 'The url field must be a valid URL.',
      },
      duration: {
        isInt: 'The duration field must be a number in seconds.',
      },
      thumbnailId: {
        isUUID: 'The thumbnailId must be a UUID.',
      },
      unitId: {
        isInt: 'The unitId must be a number.',
      },
    },
  },
};

export default validationMessages_EN;
