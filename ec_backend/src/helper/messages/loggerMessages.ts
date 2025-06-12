const loggerMessages = {
  student: {
    checkStudentExists: {
      status_409:
        "There's another student with the same name in the database. Check the error log for more details.",
    },
    registerStudent: {
      status_201: 'A new student has been successfully registered!',
      status_500:
        'An internal error occurred while registering the student. Check the error log for more information.',
    },
  },
};

export default loggerMessages;
