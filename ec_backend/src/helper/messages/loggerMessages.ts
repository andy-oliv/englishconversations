const loggerMessages = {
  answeredExercise: {
    checkIfAnswered: {
      status_500:
        'An internal error occurred while checking for previous answers to the exercise. Check the error log for more information.',
    },
    saveAnswer: {
      status_500:
        'An internal error occurred while generating the answer to the exercise. Check the error log for more information.',
    },
    deleteAnswer: {
      status_200: 'An answer has been deleted.',
      status_500:
        'An internal error occurred while deleting the answer. Check the error log for more information.',
    },
    fetchAnswers: {
      status_500:
        'An internal error occurred while fetching the list of answers. Check the error log for more information.',
    },
    fetchAnswerById: {
      status_500:
        'An internal error occurred while fetching the answer. Check the error log for more information.',
    },
    fetchAnswersByUser: {
      status_500:
        'An internal error occurred while fetching the answers. Check the error log for more information.',
    },
    addFeedback: {
      status_200: 'An answer has been updated.',
      status_500:
        'An internal error occurred while updating the answer. Check the error log for more information.',
    },
  },
  answeredQuiz: {
    addFeedback: {
      status_500:
        'An internal error occurred while updating the answer. Check the error log for more information.',
    },
    checkIsRetry: {
      status_500:
        'An internal error occurred while checking if the student has answered the quiz before. Check the error log for more information.',
    },
    deleteAnswer: {
      status_500:
        'An internal error occurred while deleting the answer. Check the error log for more information.',
    },
    fetchAnswers: {
      status_500:
        'An internal error occurred while fetching the answers. Check the error log for more information.',
    },
    fetchAnswerById: {
      status_500:
        'An internal error occurred while fetching the answer. Check the error log for more information.',
    },
    fetchAnswersByUser: {
      status_500:
        'An internal error occurred while fetching the answers. Check the error log for more information.',
    },
    saveAnswer: {
      status_500:
        'An internal error occurred while saving the answer. Check the error log for more information.',
    },
    throwIfNotAnsweredQuiz: {
      status_500:
        'An internal error occurred while saving the answer. Check the error log for more information.',
    },
  },
  auth: {
    adminVerification: {
      status_400:
        'A user attempted to log into the admin dashboard with incorrect credentials or lacks administrative permissions.',
      status_500:
        'An internal error occurred while validating the admin user. Check the error log for more information.',
    },
    addRefreshTokenToDatabase: {
      status_500:
        'An internal error occurred while adding the refresh token to the database. Check the error log for more information.',
    },
    checkEmailExists: {
      status_500:
        'An internal error occurred while checking the email. Check the error log for more information.',
    },
    emailConfirmed: {
      status_500:
        'An internal error occurred while checking the email confirmation token. Check the error log for more information.',
    },
    fetchUser: {
      status_500:
        'An internal error occurred while fetching the user data from the payload. Check the error log for more information.',
    },
    generateAccessToken: {
      status_500:
        'An internal error occurred while generating the access token. Check the error log for more information.',
    },
    generateAdminAccessToken: {
      status_500:
        'An internal error occurred while generating the access token. Check the error log for more information.',
    },
    generateEmailConfirmationToken: {
      status_404:
        'A user tried resetting their password but the register was not found.',
      status_500:
        'An internal error occurred while generating the confirmation token. Check the error log for more information.',
    },
    generateRefreshToken: {
      status_500:
        'An internal error occurred while generating the refresh token. Check the error log for more information.',
    },
    generateEmailJwt: {
      status_500:
        'An internal error occurred while generating the token. Check the error log for more information.',
    },
    generateEmailResetToken: {
      status_404:
        'A user tried resetting their email but the register was not found.',
      status_500:
        'An internal error occurred while generating the reset token. Check the error log for more information.',
    },
    generatePasswordResetToken: {
      status_404:
        'A user tried resetting their password but the register was not found.',
      status_500:
        'An internal error occurred while generating the reset token. Check the error log for more information.',
    },
    getSaltRounds: {
      checkEnv:
        'The SALT_ROUNDS variable is not correctly set. Check the .env file to fix this issue.',
    },
    login: {
      status_500:
        'An internal error occurred while logging in the user. Check the error log for more information.',
    },
    loginDataVerification: {
      status_500:
        'An internal error occurred while veryfing the user login information. Check the error log for more information.',
    },
    logout: {
      status_500:
        'An internal error occurred while logging out the user. Check the error log for more information.',
    },
    updateEmail: {
      status_500:
        'An internal error occurred while updating the email. Check the error log for more information.',
    },
    updateLastLogin: {
      status_500:
        'An internal error occurred while update the last login. Check the error log for more information.',
    },
    updatePassword: {
      status_404:
        'A user tried updating their password using an email that was not found in the database.',
      status_500:
        'An internal error occurred while updating the password. Check the error log for more information.',
    },
    validateAdminAccessToken: {
      status_500:
        'An internal error occurred while validating the administrative access token. Check the error log for more information.',
    },
    validateAccessToken: {
      status_500:
        'An internal error occurred while validating the access token. Check the error log for more information.',
    },
    validateEmailJwt: {
      status_500:
        'An internal error occurred while validating the token. Check the error log for more information.',
    },
    validateRefreshToken: {
      status_500:
        'An internal error occurred while validating the refresh token. Check the error log for more information.',
    },
    verifyPassword: {
      status_500:
        'An internal error occurred while verifying the password. Check the error log for more information.',
    },
    verifyToken: {
      status_404:
        'A user tried updating their password but the token is not connected to the user register.',
      status_500:
        'An internal error occurred while verifying the token. Check the error log for more information.',
    },
  },
  authGuard: {
    userHasAdminToken:
      'The user provided a valid administrative access token. Moving forward with the request...',
    userHasAccessToken:
      'The user provided an access token. Moving forward with the request...',
    userHasRefreshToken:
      'The user did not provide an access token but they have a refresh token. Generating new access token and moving forward with the request...',
    userWithoutCredentials:
      'The user did not provide any credentials. Request to access content denied.',
  },
  authRole: {
    status_403:
      'A user tried to access content without the required credentials.',
  },
  chapter: {
    deleteChapter: {
      status_200: 'A chapter has been deleted.',
      status_500:
        'An internal error occurred while deleting the chapter. Check the error log for more information.',
    },
    fetchChapters: {
      status_500:
        'An internal error occurred while fetching the chapter. Check the error log for more information.',
    },
    fetchChapterById: {
      status_500:
        'An internal error occurred while fetching the chapter. Check the error log for more information.',
    },
    generateChapter: {
      status_500:
        'An internal error occurred while generating the chapter. Check the error log for more information.',
    },
    generateUserChapterRelations: {
      status_500:
        'An internal error occurred while generating the userChapter relations.',
    },
    throwIfChapterExists: {
      status_500:
        'An internal error occurred while checking for conflict with the chapter being created. Check the error log for more information.',
    },
    updateChapter: {
      status_200: 'A chapter has been updated.',
      status_500:
        'An internal error occurred while updating the chapter. Check the error log for more information.',
    },
  },
  content: {
    createContent: {
      status_500:
        'An internal error occurred while creating the content. Check the error log for more information.',
    },
    deleteContent: {
      status_200: 'A content has been deleted from the database.',
      status_500:
        'An internal error occurred while deleting the content. Check the error log for more information.',
    },
    fetchContents: {
      status_500:
        'An internal error occurred while fetching the contents. Check the error log for more information.',
    },
    fetchContentsByUnit: {
      status_500:
        'An internal error occurred while fetching the contents. Check the error log for more information.',
    },
    generateUserContent: {
      status_500:
        'An internal error occurred while generating the userContents. Check the error log for more information.',
    },
  },
  dashboard: {
    fetchInfo: {
      status_500:
        'An internal error occurred while fetching the dashboard data. Check the error log for more information.',
    },
  },
  email: {
    sendEmail: {
      status_500:
        'An internal error occurred while sending the email. Check the error log for more information.',
    },
  },
  emailValidationGuard: {
    status_401:
      'A user without a confirmed email address has tried to access the system.',
  },
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
    throwIfNotQuiz: {
      status_500:
        'An internal error occurred while fetching the quiz. Check the error log for more information.',
    },
    updateExercise: {
      status_200: 'An exercise has been updated.',
      status_500:
        'An internal error occurred while updating the exercise. Check the error log for more information.',
    },
  },
  file: {
    deleteFile: {
      status_200: 'A file has been deleted.',
      status_500:
        'An internal error occurred while deleting the file file. Check the error log for more information.',
    },
    fetchFiles: {
      status_500:
        'An internal error occurred while fetching the file files. Check the error log for more information.',
    },
    fetchFileById: {
      status_500:
        'An internal error occurred while fetching the file file. Check the error log for more information.',
    },
    generateFile: {
      status_500:
        'An internal error occurred while generating the file file. Check the error log for more information.',
    },
    updateFile: {
      status_200: 'A file has been updated.',
      status_500:
        'An internal error occurred while updating the file file. Check the error log for more information.',
    },
  },
  helper: {
    fileUploadHandler: {
      status_500:
        'An internal error occurred while validating the new file. Check the error log for more information.',
    },
  },
  loginLog: {
    fetchLogs: {
      status_500:
        'An internal error occurred while fetching the logs. Check the error log for more information. ',
    },
    fetchMonthlyLogs: {
      status_500:
        'An internal error occurred while fetching the logs. Check the error log for more information. ',
    },
    fetchTodayLogs: {
      status_500:
        'An internal error occurred while fetching the logs. Check the error log for more information. ',
    },
    fetchUserLogs: {
      status_500:
        'An internal error occurred while fetching the logs. Check the error log for more information. ',
    },
    generateLog: {
      status_500:
        'An internal error occurred while generating the log. Check the error log for more information. ',
    },
  },
  notification: {
    deleteNotification: {
      status_500:
        'An internal error occurred while deleting the notification. Check the error log for more information.',
    },
    fetchNotifications: {
      status_500:
        'An internal error occurred while fetching the notifications. Check the error log for more information.',
    },
    fetchNotificationById: {
      status_500:
        'An internal error occurred while fetching the notification. Check the error log for more information.',
    },
    generateNotification: {
      status_500:
        'An internal error occurred while generating the notification. Check the error log for more information.',
    },
    updateNotification: {
      status_500:
        'An internal error occurred while updating the notification. Check the error log for more information.',
    },
  },
  quiz: {
    addExercise: {
      status_200: 'An exercise has been added to a quiz.',
      status_500:
        'An internal error occurred while adding the exercise. Check the error log for more information.',
    },
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
    fetchQuizWithExercises: {
      status_500:
        'An internal error occurred while fetching the quiz. Check the error log for more information.',
    },
    removeExercise: {
      status_200: 'An exercises was removed from a quiz.',
      status_500:
        'An internal error occurred while adding the exercise. Check the error log for more information.',
    },
    throwIfExerciseAdded: {
      status_500:
        'An internal error occurred while checking if the exercise exists in a quiz. Check the error log for more information.',
    },
    throwIfExerciseNotAdded: {
      status_500:
        'An internal error occurred while checking if the exercise exists in the quiz. Check the error log for more information.',
    },
    throwIfQuizExists: {
      status_409:
        "There's another quiz with the same definitions. Check the error log for more details.",
      status_500:
        'An internal error occurred while checking if the quiz exists. Check the error log for more information.',
    },
    updateQuiz: {
      status_200: 'A quiz has been updated.',
      status_500:
        'An internal error occurred while updating the quiz. Check the error log for more information.',
    },
  },
  selfGuard: {
    warn: `Attempt to access unauthorized resource. ID override.`,
    status_403: 'Blocked access attempt by role ${request.user.role}',
  },
  slide: {
    deleteSlide: {
      status_500:
        'An internal error occurred while deleting the slide. Check the error log for more information.',
    },
    generateSlide: {
      status_500:
        'An internal error occurred while generating the slide. Check the error log for more information.',
    },
    updateSlide: {
      status_500:
        'An internal error occurred while updating the slide. Check the error log for more information.',
    },
  },
  slideshow: {
    deleteSlideshow: {
      status_500:
        'An internal error occurred while deleting the slideshow. Check the error log for more information.',
    },
    generateSlideshow: {
      status_500:
        'An internal error occurred while generating the slideshow. Check the error log for more information.',
    },
    fetchSlideshows: {
      status_500:
        'An internal error occurred while fetching the slideshows. Check the error log for more information.',
    },
    fetchSlideshowById: {
      status_500:
        'An internal error occurred while fetching the slideshow. Check the error log for more information.',
    },
  },
  slideshowProgress: {
    deleteProgress: {
      status_500:
        'An internal error occurred while deleting the progress. Check the error log for more information.',
    },
    generateProgress: {
      status_500:
        'An internal error occurred while generating the progress. Check the error log for more information.',
    },
    fetchProgresses: {
      status_500:
        'An internal error occurred while fetching the progresses. Check the error log for more information.',
    },
    fetchProgressById: {
      status_500:
        'An internal error occurred while fetching the progress. Check the error log for more information.',
    },
    fetchProgressesByUser: {
      status_500:
        'An internal error occurred while fetching the progress. Check the error log for more information.',
    },
    updateProgress: {
      status_500:
        'An internal error occurred while updating the progress. Check the error log for more information.',
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
  s3: {
    deleteFileFromS3: {
      status_500:
        'An internal error occurred while deleting the file from S3 server. Check the error log for more information.',
    },
    deleteObject: {
      status_200: 'An object has been deleted.',
      status_500:
        'An internal error occurred while deleting the object. Check the error log for more information.',
    },
    getObject: {
      status_200: 'A download link has been generated.',
      status_500:
        'An internal error occurred while fetching the object. Check the error log for more information.',
    },
    putObject: {
      status_201: 'An object has been uploaded.',
      status_500:
        'An internal error occurred while uploading the object. Check the error log for more information.',
    },
  },
  tag: {
    addTag: {
      status_500:
        'An internal error occurred while adding the tag. Check the error log for more information.',
    },
    createTag: {
      status_200: 'A new tag has been created.',
      status_500:
        'An internal error occurred while creating the tag. Check the error log for more information.',
    },
    deleteTag: {
      status_200: 'A tag has been deleted.',
      status_500:
        'An internal error occurred while deleting the tag. Check the error log for more information.',
    },
    fetchTags: {
      status_500:
        'An internal error occurred while fetching the tags. Check the error log for more information.',
    },
    fetchTagById: {
      status_500:
        'An internal error occurred while fetching the tag. Check the error log for more information.',
    },
    fetchContentByTag: {
      status_500:
        'An internal error occurred while fetching the tag. Check the error log for more information.',
    },
    removeTag: {
      status_500:
        'An internal error occurred while removing the tag. Check the error log for more information.',
    },
  },
  unit: {
    createUnit: {
      status_500:
        'An internal error occurred while creating the unit. Check the error log for more information.',
    },
    deleteUnit: {
      status_500:
        'An internal error occurred while deleting the unit. Check the error log for more information.',
    },
    fetchUnits: {
      status_500:
        'An internal error occurred while fetching the units. Check the error log for more information.',
    },
    fetchUnitById: {
      status_500:
        'An internal error occurred while fetching the unit. Check the error log for more information.',
    },
    fetchByChapter: {
      status_500:
        'An internal error occurred while fetching the units. Check the error log for more information.',
    },
    generateUserUnitRelations: {
      status_500:
        'An internal error occurred while generating the userUnit progresses. Check the error log for more information.',
    },
    updateUnit: {
      status_500:
        'An internal error occurred while updating the unit. Check the error log for more information.',
    },
  },
  user: {
    deleteUser: {
      status_200: 'A user register has been deleted.',
      status_500:
        'An internal error occurred while deleting the user. Check the error log for more information.',
    },
    fetchUsers: {
      status_500:
        'An internal error occurred while fetching the users. Check the error log for more information.',
    },
    fetchUserById: {
      status_500:
        'An internal error occurred while fetching the user. Check the error log for more information.',
    },
    fetchUserByEmail: {
      status_500:
        'An internal error occurred while fetching the user. Check the error log for more information.',
    },
    generateUserChapterRelations: {
      status_500:
        'An internal error occurred while generating the userChapter relations.',
    },
    generateUserContentRelations: {
      status_500:
        'An internal error occurred while generating the userContent relations.',
    },
    generateUserUnitRelations: {
      status_500:
        'An internal error occurred while generating the userUnit relations.',
    },
    hashPassword: {
      status_500:
        'An internal error occurred while hashing the password. Check the error log for more information.',
    },
    getSaltRounds: {
      status_500:
        'An internal error occurred while getting the salt rounds. Check the error log for more information.',
    },
    registerUser: {
      status_200: 'A new user has been successfully registered.',
      status_500:
        'An internal error occurred while registering the user. Check the error log for more information.',
    },
    updateUser: {
      status_200: 'A user register has been updated.',
      status_2002:
        'A user is updating their avatar. The previous avatar has been deleted.',
      status_500:
        'An internal error occurred while updating the user. Check the error log for more information.',
    },
    validateUserAvailability: {
      status_500:
        'An internal error occurred while checking if a user exists. Check the error log for more information.',
    },
  },
  userChapter: {
    deleteUserChapter: {
      status_200: 'A user progress has been deleted.',
      status_500:
        'An internal error occurred while deleting the user progress. Check the error log for more information.',
    },
    fetchUserChapters: {
      status_500:
        'An internal error occurred while fetching the user progresses. Check the error log for more information.',
    },
    fetchUserChapterById: {
      status_500:
        'An internal error occurred while fetching the user progress. Check the error log for more information.',
    },
    fetchUserChaptersByUser: {
      status_500:
        'An internal error occurred while fetching the user progress. Check the error log for more information.',
    },
    generateUserChapter: {
      status_500:
        'An internal error occurred while generating the user progress. Check the error log for more information.',
    },
    syncUserLanguageLevel: {
      status_500:
        'An internal error occurred while syncing the user language level. Check the error log for more information.',
    },
    throwIfUserChapterExists: {
      status_500:
        'An internal error occurred while checking if the user progress exists. Check the error log for more information.',
    },
    unlockFirstUnit: {
      status_500:
        'An internal error occurred while unlocking the first unit. Check the error log for more information.',
    },
    unlockNextChapter: {
      status_500:
        'An internal error occurred while unlocking the next chapter. Check the error log for more information.',
    },
    updateUserChapter: {
      status_200: 'A chapter has been updated.',
      status_500:
        'An internal error occurred while updating the user progress. Check the error log for more information.',
    },
  },
  userContent: {
    createUserContent: {
      status_500:
        'An error occurred while creating the progress. Check the error log for more information.',
    },
    deleteUserContent: {
      status_500:
        'An error occurred while deleting the progress. Check the error log for more information.',
    },
    fetchUserContents: {
      status_500:
        'An error occurred while fetching the progresses. Check the error log for more information.',
    },
    fetchUserContentsByUser: {
      status_500:
        'An error occurred while fetching the progresses. Check the error log for more information.',
    },
    saveFavoriteAndNotes: {
      status_500:
        'An error occurred while saving the favorite and notes. Check the error log for more information.',
    },
    unlockNextContent: {
      status_500:
        'An error occurred while unlocking the next content. Check the error log for more information.',
    },
    updateUserContent: {
      status_500:
        'An error occurred while updating the progress. Check the error log for more information.',
    },
    updateUserContentRelation: {
      status_500:
        'An error occurred while updating the user-content relationship table. Check the error log for more information.',
    },
  },
  userNotification: {
    deleteUserNotification: {
      status_500:
        'An internal error occurred while deleting the notification. Check the error log for more information.',
    },
    fetchUserNotifications: {
      status_500:
        'An internal error occurred while fetching the notifications. Check the error log for more information.',
    },
    generateUserNotification: {
      status_500:
        'An internal error occurred while generating the notification. Check the error log for more information.',
    },
    updateUserNotification: {
      status_500:
        'An internal error occurred while updating the notification. Check the error log for more information.',
    },
  },
  userProgress: {
    fetchCurrentChapterProgress: {
      status_500:
        'An internal error occurred while fetching the chapter progress. Check the error log for more information.',
    },
    fetchProgress: {
      status_500:
        'An internal error occurred while fetching the user progress. Check the error log for more information.',
    },
  },
  userUnit: {
    deleteUserUnit: {
      status_200: 'A user progress has been deleted.',
      status_500:
        'An internal error occurred while deleting the user progress. Check the error log for more information.',
    },
    fetchUserUnits: {
      status_500:
        'An internal error occurred while fetching the user progresses. Check the error log for more information.',
    },
    fetchUserUnitById: {
      status_500:
        'An internal error occurred while fetching the user progress. Check the error log for more information.',
    },
    fetchUserUnitsByQuery: {
      status_500:
        'An internal error occurred while fetching the user progresses. Check the error log for more information.',
    },
    generateUserUnit: {
      status_500:
        'An internal error occurred while generating the user progress. Check the error log for more information.',
    },
    unlockFirstContent: {
      status_500:
        'An internal error occurred while unlocking the first content. Check the error log for more information.',
    },
    unlockNextUnit: {
      status_500:
        'An internal error occurred while unlocking the next unit. Check the error log for more information.',
    },
    throwIfUserUnitExists: {
      status_500:
        'An internal error occurred while checking if the user progress already exists. Check the error log for more information.',
    },
    updateUserUnit: {
      status_200: 'A user progress has been updated.',
      status_500:
        'An internal error occurred while updating the user progress. Check the error log for more information.',
    },
  },
  video: {
    deleteVideo: {
      status_200: 'A video has been deleted.',
      status_500:
        'An internal error occurred while deleting the video. Check the error log for more information.',
    },
    fetchVideos: {
      status_500:
        'An internal error occurred while fetching the videos. Check the error log for more information.',
    },
    fetchVideoById: {
      status_500:
        'An internal error occurred while fetching the video. Check the error log for more information.',
    },
    generateVideo: {
      status_500:
        'An internal error occurred while generating the video. Check the error log for more information.',
    },
    updateVideo: {
      status_200: 'A video has been updated.',
      status_500:
        'An internal error occurred while updating the video. Check the error log for more information.',
    },
  },
  videoProgress: {
    deleteProgress: {
      status_500:
        'An internal error occurred while deleting the progress connection. Check the error log for more information.',
    },
    fetchVideoProgresses: {
      status_500:
        'An internal error occurred while fetching the progress connection. Check the error log for more information.',
    },
    fetchVideoProgressById: {
      status_500:
        'An internal error occurred while fetching the progress connection. Check the error log for more information.',
    },
    fetchVideoProgressesByUser: {
      status_500:
        'An internal error occurred while fetching the progress connection. Check the error log for more information.',
    },
    generateVideoProgress: {
      status_500:
        'An internal error occurred while generating the progress connection. Check the error log for more information.',
    },
    throwIfProgressExists: {
      status_500:
        'An internal error occurred while checking if the progress connection already exists. Check the error log for more information.',
    },
    updateProgress: {
      status_500:
        'An internal error occurred while updating the progress connection. Check the error log for more information.',
    },
  },
};

export default loggerMessages;
