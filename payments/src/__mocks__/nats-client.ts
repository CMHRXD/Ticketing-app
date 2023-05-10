export const natsClient = {
  client: {
    publish: jest
      .fn() // jest.fn() is a mock function 
      .mockImplementation(  // mockImplementation() is a mock function and it is used to mock the implementation of a function
        (subject: string, data: string, callback: () => void) => { // mockImplementation() takes a function as an argument
          callback();
        }
      ),
  },
};
