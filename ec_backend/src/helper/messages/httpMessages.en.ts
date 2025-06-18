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
  tag: {
    addTag: {
      status_200: 'The tag has been successfully added.',
      status_400: 'Invalid content type.',
      status_404:
        'Check the request, either the tag or the desired content do not exist',
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
    },
    updateVideo: {
      status_200: 'The video has been successfully updated!',
      status_404: 'The video was not found or the ID is invalid.',
    },
  },
};

export default httpMessages_EN;
