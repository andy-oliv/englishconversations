const validationMessages_EN = {
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
