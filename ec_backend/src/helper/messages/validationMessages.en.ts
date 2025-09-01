import { isNotEmpty } from 'class-validator';
import CreateUserContentDTO from 'src/user-content/dto/CreateUserContent.dto';

const validationMessages_EN = {
  answeredExercise: {
    saveAnswerDTO: {
      exerciseId: {
        isNotEmpty: 'The exerciseId field must not be empty.',
        isInt: 'The exerciseId must be an INT.',
      },
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId field is not a valid UUID.',
      },
      answeredQuizId: {
        isUUID: 'The answeredQuizId is not a valid UUID.',
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
    completeQuizDTO: {
      quizId: {
        isNotEmpty: 'The quizId field must not be empty.',
        isUUID: 'The quizId field must be a valid UUID.',
      },
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId field must be a valid UUID.',
      },
      score: {
        isNotEmpty: 'The score field must not be empty.',
        isInt: 'The score field must be a number.',
      },
      userContentId: {
        isNotEmpty: 'The userContentId field must not be empty.',
        isInt: 'The userContentId field must be a number.',
      },
      elapsedTime: {
        isNotEmpty: 'The elapsedTime field must not be empty.',
        isInt: 'The elapsedTime field must be a number.',
      },
      answers: {
        isNotEmpty: 'The answers field must not be empty.',
        isArray: 'The answers field must be an array.',
      },
      isTest: {
        isBoolean: 'The isTest field must be a boolean.',
      },
      isPassed: {
        isNotEmpty: 'The isPassed field must not be empty.',
        isBoolean: 'The isPassed field must be a boolean.',
      },
    },
    quizId: {
      isNotEmpty: 'The quizId field must not be empty.',
      isUUID: 'The quizId field must be a valid UUID.',
    },
    userId: {
      isNotEmpty: 'The userId field must not be empty.',
      isUUID: 'The userId field must be a valid UUID.',
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
    userContentId: {
      isNotEmpty: 'The userContentId field must not be empty.',
      isInt: 'The userContentId field must be a number.',
    },
  },
  auth: {
    checkTokenDTO: {
      token: {
        isNotEmpty: 'The token field must not be empty',
        isString: 'The token field must be a string.',
      },
    },
    loginDTO: {
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
    generateResetTokenDTO: {
      email: {
        isNotEmpty: 'The email field must not be empty.',
        isEmail:
          'The email field must be a valid email (example: user@mail.com)',
      },
    },
    updateEmailDTO: {
      email: {
        isNotEmpty: 'The email field must not be empty.',
        isEmail:
          'The email field must be a valid email (example: user@mail.com)',
      },
    },
    updatePasswordDTO: {
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
      imageUrl: {
        isUrl: 'The imageUrl field must be a valid URL.',
      },
      order: {
        isInt: 'The order field must be a number.',
      },
    },
  },
  content: {
    createContentDTO: {
      unitId: {
        isNotEmpty: 'The unitId field must not be empty.',
        isInt: 'The unitId field must be a number.',
      },
      contentType: {
        isNotEmpty: 'The contentType field must not be empty.',
        isIn: 'The contentType field is invalid.',
      },
      videoId: {
        isUUID: 'The videoId field must be a UUID.',
      },
      slideshowId: {
        isUUID: 'The slideshowId field must be a UUID.',
      },
      quizId: {
        isUUID: 'The quizId field must be a UUID.',
      },
      order: {
        isNotEmpty: 'The order field must not be empty.',
        isInt: 'The order field must be a number.',
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
        isNumber: 'The size field must be a number in MB',
      },
    },
  },
  notification: {
    type: {
      isNotEmpty: 'The type field must not be empty',
      isIn: 'The type field is invalid.',
    },
    title: {
      isNotEmpty: 'The title field must not be empty',
      isString: 'The title field must be a string.',
    },
    content: {
      isNotEmpty: 'The content field must not be empty',
      isString: 'The content field must be a string.',
    },
    actionUrl: {
      isUrl: 'The actionUrl field must be a valid URL.',
    },
    expirationDate: {
      isDate: 'The expirationDate field must be a valid date.',
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
  Slide: {
    generateSlideDTO: {
      slideshowId: {
        isNotEmpty: 'The slideshowId field must not be empty.',
        isUUID: 'The slideshowId field must be a UUUID.',
      },
      title: {
        isNotEmpty: 'The title field must not be empty.',
        isString: 'The title field must be a string.',
      },
      description: {
        isNotEmpty: 'The description field must not be empty.',
        isString: 'The description field must be a string.',
      },
      type: {
        isNotEmpty: 'The type field must not be empty.',
        isIn: 'The type field is invalid.',
      },
      url: {
        isNotEmpty: 'The url field must not be empty.',
        isUrl: 'The url field must be a valid URL.',
      },
      order: {
        isNotEmpty: 'The order field must not be empty.',
        isInt: 'The order field must be a number.',
      },
    },
  },
  slideshow: {
    generateSlideshowDTO: {
      title: {
        isNotEmpty: 'The title field must not be empty.',
        isString: 'The title field must be a string.',
      },
      description: {
        isNotEmpty: 'The description field must not be empty.',
        isString: 'The description field must be a string.',
      },
    },
  },
  slideshowProgress: {
    generateProgressDTO: {
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId must be a UUID.',
      },
      slideshowId: {
        isNotEmpty: 'The slideshowId field must not be empty.',
        isUUID: 'The slideshowId must be a UUID.',
      },
      status: {
        isIn: 'The status is invalid.',
      },
      progress: {
        isNumber: 'The progress must be a valid number.',
      },
      userContentId: {
        isNotEmpty: 'The userContentId field must not be empty.',
        isInt: 'The userContentId field must be a number.',
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
  subject: {
    createSubjectDTO: {
      title: {
        isNotEmpty: 'The title field must not be empty.',
        isString: 'The title field must be a string.',
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
  unit: {
    createUnitDTO: {
      name: {
        isNotEmpty: 'The name field must not be empty.',
        isString: 'The name field must be a string.',
      },
      description: {
        isNotEmpty: 'The description field must not be empty.',
        isString: 'The description field must be a string.',
      },
      chapterId: {
        isNotEmpty: 'The chapterId field must not be empty.',
        isUUID: 'The chapterId field must be a UUID.',
      },
      imageUrl: {
        isUrl: 'The imageUrl field must be a valid URL.',
      },
      order: {
        isNotEmpty: 'The order field must not be empty.',
        isInt: 'The order field must be a number.',
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
      birthdate: {
        isDate: 'The birthdate field must be a date.',
      },
      city: {
        isString: 'The city field must be a string.',
      },
      state: {
        isIn: 'The state field must be a string representing the acronym of one of the 27 brazilian states, or the OTHER value for states or provinces from other countries.',
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
      birthdate: {
        isDate: 'The birthdate field must be a date.',
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
  userChapter: {
    generateUserChapterDTO: {
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId field must be a UUID.',
      },
      chapterId: {
        isNotEmpty: 'The chapterId field must not be empty.',
        isUUID: 'The chapterId field must be a UUID.',
      },
    },
    updateUserChapterDTO: {
      status: {
        isIn: 'The status field is invalid.',
      },
      progress: {
        isNumber: 'The progress field must be a number.',
      },
      completedAt: {
        isDate: 'The completedAt field must be a date.',
      },
    },
  },
  userContent: {
    completeContentDTO: {
      videoId: {
        isUUID: 'The video field must be a UUID.',
      },
      watchedDuration: {
        isInt: 'The watchedDuration field must be an integer.',
      },
      startedAt: {
        isDate: 'The startedAt field must be a valid date.',
      },

      slideshowId: {
        isUUID: 'The slideshowId field must be a UUID.',
      },
    },
    createUserContentDTO: {
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId field must be a UUID.',
      },
      contentId: {
        isNotEmpty: 'The contentId field must not be empty.',
        isInt: 'The contentId field must be a number.',
      },
      status: {
        isIn: 'The status field is invalid.',
      },
      progress: {
        isNumber: 'The progress field must be a number.',
      },
    },
    updateUserContentDTO: {
      progress: {
        isNumber: 'The progress field must be a number.',
      },
      isFavorite: {
        isBoolean: 'The isFavorite field must be a boolean.',
      },
      notes: {
        isString: 'The note field must be a string.',
      },
    },
  },
  userNotification: {
    userId: {
      isNotEmpty: 'The userId field must not be empty.',
      isUUID: 'The userId field must be a UUID.',
    },
    notificationId: {
      isNotEmpty: 'The notificationId is must not be empty.',
      isInt: 'The notificationId must be a number.',
    },
    isRead: {
      isBoolean: 'The isRead field must be a boolean.',
    },
    readAt: {
      isDate: 'The readAt field must be a date.',
    },
    deliveredViaEmail: {
      isBoolean: 'The deliveredViaEmail field must be a boolean.',
    },
    deliveredViaApp: {
      isBoolean: 'The deliveredViaApp field must be a boolean.',
    },
  },
  userUnit: {
    generateUserUnitDTO: {
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId field must be a UUID.',
      },
      unitId: {
        isNotEmpty: 'The unitId field must not be empty.',
        isInt: 'The unitId field must be a number.',
      },
    },
    fetchUserUnitsByQueryDTO: {
      userId: {
        isUUID: 'The userId field must be a UUID.',
      },
      unitId: {
        isInt: 'The unitId field must be a number.',
      },
      status: {
        isIn: 'The status field is invalid.',
      },
    },
    updateUserUnitDTO: {
      status: {
        isIn: 'The status field is invalid.',
      },
      progress: {
        isNumber: 'The progress field must be a number.',
      },
      completedAt: {
        isDate: 'The completedAt field must be a date.',
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
      thumbnailUrl: {
        isUrl: 'The thumbnailUrl must be a URL.',
      },
    },
  },
  videoProgress: {
    generateVideoProgressDTO: {
      userId: {
        isNotEmpty: 'The userId field must not be empty.',
        isUUID: 'The userId field must be a UUID.',
      },
      videoId: {
        isNotEmpty: 'The videoId field must not be empty.',
        isUUID: 'The videoId field must be a UUID.',
      },
      userContentId: {
        isNotEmpty: 'The userContentId field must not be empty.',
        isInt: 'The userContentId field must be a number.',
      },
    },
    updateVideoProgressDTO: {
      progress: {
        isInt: 'The progress field must be a number.',
      },
      watchedDuration: {
        isInt: 'The watchedDuration field must be a number.',
      },
      watchedCount: {
        isInt: 'The watchedCount field must be a number.',
      },
      lastWatchedAt: {
        isDate: 'The lastWatchedAt field must be a date.',
      },
      startedAt: {
        isDate: 'The startedAt field must be a date.',
      },
      completedAt: {
        isDate: 'The completedAt field must be a date.',
      },
      completed: {
        isBoolean: 'The completed field must be a boolean.',
      },
      isFavorite: {
        isBoolean: 'The isFavorite field must be a boolean.',
      },
      note: {
        isString: 'The note field must be a string.',
      },
    },
  },
};

export default validationMessages_EN;
