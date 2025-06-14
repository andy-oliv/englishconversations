const httpMessages_EN = {
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
    updateExercise: {
      status_200: 'The exercise has been successfully updated!',
      status_404: 'The exercise was not found or the ID is invalid.',
    },
  },
  general: {
    status_500:
      'An unexpected error occurred. Please check the error log for more information.',
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
};

export default httpMessages_EN;
