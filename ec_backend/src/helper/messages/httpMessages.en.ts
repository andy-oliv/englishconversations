const httpMessages_EN = {
  answeredExercise: {
    saveAnswer: {
      status_201: 'The answer has been successfully saved.',
    },
    deleteAnswer: {
      status_200: 'The answer was successfully deleted.',
      status_404: 'The answer was not found or the ID is invalid.',
    },
    fetchAnswers: {
      status_200: 'The answers have been successfully fetched.',
      status_404: 'There are no answers to show.',
    },
    fetchAnswerById: {
      status_200: 'The answer was successfully fetched.',
      status_404: 'The answer was not found or the ID is invalid.',
    },
    fetchAnswerByQuery: {
      status_200: 'The answers were successfully fetched.',
      status_404: 'There are no answers to show.',
    },
    addFeedback: {
      status_200: 'The answer was successfully updated.',
      status_404: 'The answer was not found or the ID is invalid.',
    },
  },
  answeredQuiz: {
    addFeedback: {
      status_200: 'The answer has been successfully updated!',
      status_404: 'The answer was not found or the ID is invalid.',
    },
    deleteAnswer: {
      status_200: 'The answer has been successfully deleted.',
      status_404: 'The answer was not found or the ID is invalid.',
    },
    fetchAnswers: {
      status_200: 'The answers have been successfully fetched!',
      status_404: 'There are no answers to show or the ID is invalid.',
    },
    fetchAnswerById: {
      status_200: 'The answer has been successfully fetched!',
      status_404: 'The answer was not found or the ID is invalid.',
    },
    fetchAnswersByQuery: {
      status_200: 'The answers have been successfully fetched!',
      status_404: 'There are no answers to show or the ID is invalid.',
    },
    saveAnswer: {
      status_201: 'The answer has been successfully saved.',
    },
  },
  auth: {
    emailConfirmed: {
      status_400: 'The token is expired.',
    },
    fetchUser: {
      status_401: 'Unauthorized: You must login to see this content.',
    },
    generateEmailConfirmationToken: {
      status_200:
        'We have sent you an email with a link to confirm your email address.',
    },
    generateResetToken: {
      status_200:
        'If the email is correctly registered, you should have received a link to reset your password.',
    },
    login: {
      status_200: 'User successfully logged in!',
    },
    loginDataVerification: {
      status_400:
        'Please check the request. Either the user or the password are incorrect.',
    },
    logout: {
      status_200: 'User successfully logged out.',
    },
    updateEmail: {
      status_200: 'The email has been successfully updated',
      status_400: 'Invalid email. Check the request.',
      status_404: 'The user was not found or the ID is invalid.',
    },
    updatePassword: {
      status_200: 'The passsword has been successfully updated.',
      status_400: 'The token is invalid.',
    },
    validateAccessToken: {
      status_401: 'Unauthorized: You must login to see this content.',
    },
    validateRefreshToken: {
      status_401: 'Unauthorized: You must login to see this content.',
    },
    verifyPassword: {
      status_400:
        'Please check the request. Either the user or the password are incorrect.',
    },
    verifyToken: {
      status_400: 'The token is expired.',
    },
  },
  authGuard: {
    status_401: 'Unauthorized: You must login to see this content.',
  },
  authRole: {
    status_403: 'Forbidden: invalid credentials.',
  },
  chapter: {
    deleteChapter: {
      status_200: 'The chapter has been successfully deleted!',
      status_404: 'The chapter was not found or the ID is invalid.',
    },
    fetchChapters: {
      status_200: 'The chapters have been successfully fetched!',
      status_404: 'The are no chapters to show.',
    },
    fetchChapterById: {
      status_200: 'The chapter has been successfully fetched!',
      status_404: 'The chapter was not found or the ID is invalid.',
    },
    generateChapter: {
      status_200: 'The chapter has been successfully generated!',
      status_400:
        'Invalid file type. The accepted types are jpeg, png, svg and webp',
    },
    throwIfChapterExists: {
      status_409: 'There is another chapter with the same definitions.',
    },
    updateChapter: {
      status_200: 'The chapter has been successfully updated!',
      status_400: 'No data provided for update.',
      status_4002: 'There is nothing to update',
      status_4003:
        'Invalid file type. The accepted types are jpeg, png, svg and webp',
      status_404: 'The chapter was not found or the ID is invalid.',
    },
  },
  emailValidationGuard: {
    status_401:
      'Please confirm your email before trying to access the system. A confirmation email has already been sent to your email address.',
  },
  exercise: {
    createExercise: {
      status_201: 'The exercise has been successfully created!',
      status_409: 'The exercise already exists.',
    },
    deleteExercise: {
      status_200: 'The exercise has been deleted.',
      status_404: 'The exercise was not found or the ID is invalid.',
    },
    fetchExercises: {
      status_200: 'The exercises have been fetched.',
      status_404: 'There are no exercises to show.',
    },
    fetchExerciseById: {
      status_200: 'The exercise has been successfully fetched.',
      status_404: 'The exercise was not found or the ID is invalid.',
    },
    fetchExercisesByQuery: {
      status_200: 'The exercise has been successfully fetched.',
      status_404: 'The exercise was not found or the ID is invalid.',
    },
    throwIfExerciseExists: {
      status_409: 'There is another exercise with the same definitions.',
    },
    throwIfNotQuiz: {
      status_404: 'The quiz was not found or the ID is invalid.',
    },
    updateExercise: {
      status_200: 'The exercise has been successfully updated!',
      status_404: 'The exercise was not found or the ID is invalid.',
    },
  },
  file: {
    deleteFile: {
      status_200: 'The file has been successfully deleted!',
      status_404: 'The file was not found or the ID is invalid.',
    },
    fetchFiles: {
      status_200: 'The files have been successfully fetched!',
      status_404: 'The are no files to show.',
    },
    fetchFileById: {
      status_200: 'The file has been successfully fetched!',
      status_404: 'The file was not found or the ID is invalid.',
    },
    generateFile: {
      status_200: 'The file file has been successfully generated!',
    },
    updateFile: {
      status_200: 'The file has been successfully updated!',
      status_404: 'The file was not found or the ID is invalid.',
    },
  },
  general: {
    status_500:
      'An unexpected error occurred. Please check the error log for more information.',
  },
  helper: {
    status_400: 'Validation failed',
    status_4002: 'The metadata cannot be empty.',
    status_4003: 'The file cannot be empty.',
    status_4004:
      'The file type is invalid. The accepted types are jpeg, png, svg and webp',
  },
  notification: {
    deleteNotification: {
      status_200: 'The notification has been deleted.',
      status_404: 'The notification was not found or the ID is invalid.',
    },
    fetchNotifications: {
      status_200: 'The notifications have been successfully fetched.',
      status_404: 'There are no notifications to show.',
    },
    fetchNotificationById: {
      status_200: 'The notification has been successfully fetched.',
      status_404: 'The notification was not found or the ID is invalid.',
    },
    generateNotification: {
      status_200: 'A new notification has been generated!',
    },
    updateNotification: {
      status_200: 'The notification has been successfully updated.',
      status_404: 'The notification was not found or the ID is invalid.',
    },
  },
  quiz: {
    addExercise: {
      status_200: 'The exercise has been successfully added!',
      status_409: 'Exercise already added to this quiz',
    },
    createQuiz: {
      status_201: 'The quiz has been successfully created!',
    },
    deleteQuiz: {
      status_200: 'The quiz was successfully deleted.',
      status_404: 'The quiz was not found or the ID is invalid.',
    },
    fetchQuizzes: {
      status_200: 'The quizzes have been successfully fetched!',
      status_404: 'The are no quizzes to show.',
    },
    fetchQuizById: {
      status_200: 'The quiz has been successfully fetched!',
      status_404: 'The quiz was not found or the ID is invalid.',
    },
    fetchQuizzesByQuery: {
      status_200: 'The quizzes have been successfully fetched!',
      status_404: 'There are no quizzes to show.',
    },
    fetchQuizWithExercises: {
      status_404: 'The quiz was not found.',
    },
    removeExercise: {
      status_200: 'The exercise has been successfully removed!',
    },
    throwIfExerciseAdded: {
      status_409: 'The exercise has already been added to a different quiz.',
      status_4092: 'The exercise has already been added to this quiz',
    },
    throwIfExerciseNotAdded: {
      status_404: 'The exercise does not exist in the quiz.',
    },
    throwIfQuizExists: {
      status_409: 'This quiz already exists.',
    },
    updateQuiz: {
      status_200: 'The quiz was successfully updated.',
      status_404: 'The quiz was not found or the ID is invalid.',
    },
  },
  student: {
    deleteStudent: {
      status_200: 'The student has been successfully deleted!',
      status_404: 'The student was not found or the ID is invalid.',
    },
    fetchStudents: {
      status_200: 'The students were successfully fetched!',
      status_404: 'There are no students to show.',
    },
    fetchStudentById: {
      status_200: 'The student was successfully fetched!',
      status_404: "There's no student to show or the ID is invalid.",
    },
    fetchStudentsByQuery: {
      status_200:
        'The students that match the query were successfully fetched!',
      status_404: 'There are no students to show or the query is invalid.',
    },
    registerStudent: {
      status_201: 'Student successfully registered!',
    },
    throwIfStudentExists: {
      status_409: 'This student already exists.',
    },
    updateStudent: {
      status_200: 'The student was successfully updated!',
      status_404: "There's no student to show or the ID is invalid.",
    },
  },
  s3: {
    deleteObject: {
      status_200: 'The object has been successfully deleted.',
    },
    getObject: {
      checkenv:
        'Check the PRESIGNED_URL_EXPIRATION environment variable. It is not correctly set.',
      status_200: 'The object has been successfully fetched.',
    },
    putObject: {
      status_201: 'The object has been successfully uploaded.',
      status_400:
        'Invalid file type. The accepted types are: image(jpeg, png, svg, webp), audio(mpeg, wav, mp4) and pdf',
    },
  },
  tag: {
    addTag: {
      status_200: 'The tag has been successfully added.',
      status_400: 'Invalid content type.',
      status_404:
        'Please, check the request. Either the tag or the desired content do not exist',
      status_409: 'The tag has already been added.',
    },
    createTag: {
      status_201: 'The tag has been successfully created!',
      status_409: 'There is another tag with the same name.',
    },
    deleteTag: {
      status_200: 'The tag has been successfully deleted.',
      status_404: 'The tag was not found or the id is invalid.',
    },
    fetchTag: {
      status_400: 'The request cannot be empty. Check the parameters.',
    },
    fetchTags: {
      status_200: 'The tags have been successfully fetched.',
      status_404: 'There are no tags to show.',
    },
    fetchTagById: {
      status_200: 'The tag has been successfully fetched.',
      status_404: 'The tag was not found or the ID is invalid.',
    },
    fetchContentByTag: {
      status_200: 'The tag has been successfully fetched.',
      status_404: 'The tag was not found or the title is invalid.',
    },
    removeTag: {
      status_200: 'The tag has been successfully deleted.',
      status_400: 'Invalid content type.',
      status_404: 'The tag is not added to the content.',
    },
  },
  unit: {
    createUnit: {
      status_200: 'The unit has been successfully created!',
      status_404: 'The chapter was not found or the ID is invalid.',
    },
    deleteUnit: {
      status_200: 'The unit has been successfully deleted!',
      status_404: 'The unit was not found or the ID is invalid.',
    },
    fetchUnits: {
      status_200: 'The units have been successfully fetched.',
      status_404: 'There are no units to show.',
    },
    fetchUnitById: {
      status_200: 'The unit has been successfully fetched.',
      status_404: 'The unit was not found or the ID is invalid.',
    },
    updateUnit: {
      status_200: 'The unit has been successfully updated!',
      status_404: 'The unit was not found or the ID is invalid.',
      status_404B: 'The chapterId was not found or the ID is invalid.',
    },
  },
  user: {
    deleteUser: {
      status_200: 'The user has been successfully deleted.',
      status_404: 'The user was not found or the ID is invalid.',
    },
    fetchUsers: {
      status_200: 'The user list has been successfully fetched!',
      status_404: 'There are no users to show.',
    },
    fetchUserById: {
      status_200: 'The user has been successfully fetched!',
      status_404: 'The user was not found or the ID is invalid.',
    },
    fetchUserByEmail: {
      status_200: 'The user has been successfully fetched!',
      status_404: 'The user was not found or the ID is invalid.',
    },
    registerUser: {
      status_201: 'The user has been successfully registered!',
      status_400:
        'The file type is invalid. The accepted types are jpeg, png, svg and webp',
    },
    updateUser: {
      status_200: 'The user has been successfully updated.',
      status_400:
        'The file type is invalid. The accepted types are jpeg, png, svg and webp',
      status_4002: 'No data provided for update.',
      status_404: 'The user was not found or the ID is invalid.',
    },
    validateUserAvailability: {
      status_409: 'The user already exists.',
    },
  },
  userChapter: {
    deleteUserChapter: {
      status_200: 'The user progress has been successfully deleted!',
      status_404: 'The user progress was not found or the ID is invalid.',
    },
    fetchUserChapters: {
      status_200: 'The user progresses have been successfully fetched!',
      status_404: 'The are no user progresses to show.',
    },
    fetchUserChapterById: {
      status_200: 'The user progress has been successfully fetched!',
      status_404: 'The user progress was not found or the ID is invalid.',
    },
    generateUserChapter: {
      status_200: 'The user progress has been successfully generated!',
      status_404: 'The userId or the chapterId are invalid.',
    },
    throwIfChapterExists: {
      status_409: 'There is another user progress with the same definitions.',
    },
    updateUserChapter: {
      status_200: 'The user progress has been successfully updated!',
      status_404: 'The user progress was not found or the ID is invalid.',
    },
  },
  userNotification: {
    deleteUserNotification: {
      status_200: 'The notification has been deleted.',
      status_404: 'The notification was not found or the ID is invalid.',
    },
    fetchUserNotifications: {
      status_200: 'The notifications have been successfully fetched.',
      status_404: 'There are no notifications to show.',
    },
    generateUserNotification: {
      status_200: 'A new notification has been generated!',
      status_404:
        'Please, check the request. Either the user or the desired notification do not exist',
    },
  },
  userUnit: {
    deleteUserUnit: {
      status_200: 'The user progress has been successfully deleted!',
      status_404: 'The user progress was not found or the ID is invalid.',
    },
    fetchUserUnits: {
      status_200: 'The user progresses have been successfully fetched!',
      status_404: 'The are no user progresses to show.',
    },
    fetchUserUnitById: {
      status_200: 'The user progress has been successfully fetched!',
      status_404: 'The user progress was not found or the ID is invalid.',
    },
    fetchUserUnitsByQuery: {
      status_200: 'The user progresses have been successfully fetched!',
      status_404: 'There are no user progresses to show.',
    },
    generateUserUnit: {
      status_200: 'The user progress has been successfully generated!',
      status_404: 'The userId or the chapterId are invalid.',
    },
    throwIfUserUnitExists: {
      status_409: 'There is another user progress with the same definitions.',
    },
    updateUserUnit: {
      status_200: 'The user progress has been successfully updated!',
      status_404: 'The user progress was not found or the ID is invalid.',
    },
  },
  video: {
    deleteVideo: {
      status_200: 'The video has been successfully deleted!',
      status_404: 'The video was not found or the ID is invalid.',
    },
    fetchVideos: {
      status_200: 'The videos have been successfully fetched!',
      status_404: 'The are no videos to show.',
    },
    fetchVideoById: {
      status_200: 'The video has been successfully fetched!',
      status_404: 'The video was not found or the ID is invalid.',
    },
    generateVideo: {
      status_200: 'The video file has been successfully generated!',
      status_400:
        'Invalid file type. The accepted types are jpeg, png, svg and webp',
    },
    updateVideo: {
      status_200: 'The video has been successfully updated!',
      status_400: 'No data provided for update.',
      status_4002: 'There is nothing to update.',
      status_4003:
        'Invalid file type. The accepted types are jpeg, png, svg and webp',
      status_404: 'The video was not found or the ID is invalid.',
    },
  },
  videoProgress: {
    deleteProgress: {
      status_200: 'The progress connection has been successfully deleted.',
      status_404: 'The progress connection was not found or the ID is invalid.',
    },
    fetchVideoProgresses: {
      status_200: 'The progress connections have been successfully fetched!',
      status_404: 'There are no progress connections to show.',
    },
    fetchVideoProgressById: {
      status_200: 'The progress connection has been successfully fetched!',
      status_404: 'The progress connection was not found or the ID is invalid.',
    },
    fetchVideoProgressesByUser: {
      status_200: 'The progress connections have been successfully fetched!',
      status_404:
        'There are no progress connections to show or the userId is invalid.',
    },
    generateVideoProgress: {
      status_201: 'Progress connection has been successfully generated.',
      status_400:
        'Check the request. Either the userId or the videoId are invalid.',
    },
    throwIfProgressExists: {
      status_409: 'The progress connection already exists.',
    },
    updateProgress: {
      status_200: 'The progress connection has been successfully updated.',
      status_404: 'The progress connection was not found or the ID is invalid.',
    },
  },
};

export default httpMessages_EN;
