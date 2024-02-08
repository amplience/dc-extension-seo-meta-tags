export const init = async <T>() => {
  const sdk = {
    connection: {
      request: jest.fn(),
    },
    field: {
      schema: {
        title: "Wow, what an amazing extension!",
      },
    },
    form: {
      getValue: jest.fn(),
    },
    params: {
      installation: {
        type: "description",
        sources: ["/content"],
      },
    },
  } as T;

  return sdk;
};
