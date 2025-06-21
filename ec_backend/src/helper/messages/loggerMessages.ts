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
    fetchAnswerByQuery: {
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
    fetchAnswersByQuery: {
      status_500:
        'An internal error occurred while fetching the answers. Check the error log for more information.',
    },
    saveAnswer: {
      status_500:
        'An internal error occurred while saving the answer. Check the error log for more information.',
    },
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
        'An internal error occurred while creating the student. Check the error log for more information.',
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
      status_200: 'A video has been deleted.',
      status_500:
        'An internal error occurred while deleting the video file. Check the error log for more information.',
    },
    fetchUserChapters: {
      status_500:
        'An internal error occurred while fetching the video files. Check the error log for more information.',
    },
    fetchUserChapterById: {
      status_500:
        'An internal error occurred while fetching the video file. Check the error log for more information.',
    },
    generateUserChapter: {
      status_500:
        'An internal error occurred while generating the video file. Check the error log for more information.',
    },
    throwIfUserChapterExists: {
      status_500:
        'An internal error occurred while checking if the user progress exists. Check the error log for more information.',
    },
    updateUserChapter: {
      status_200: 'A video has been updated.',
      status_500:
        'An internal error occurred while updating the video file. Check the error log for more information.',
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
  },
  video: {
    deleteVideo: {
      status_200: 'A video has been deleted.',
      status_500:
        'An internal error occurred while deleting the video file. Check the error log for more information.',
    },
    fetchVideos: {
      status_500:
        'An internal error occurred while fetching the video files. Check the error log for more information.',
    },
    fetchVideoById: {
      status_500:
        'An internal error occurred while fetching the video file. Check the error log for more information.',
    },
    generateVideo: {
      status_500:
        'An internal error occurred while generating the video file. Check the error log for more information.',
    },
    updateVideo: {
      status_200: 'A video has been updated.',
      status_500:
        'An internal error occurred while updating the video file. Check the error log for more information.',
    },
  },
};

export default loggerMessages;
