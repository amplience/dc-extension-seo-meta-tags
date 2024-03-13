export const init = async <T>() => {
  const sdk = {
    connection: {
      request: jest.fn(),
      emit: jest.fn(),
    },
    field: {
      getValue: jest.fn(),
      setValue: jest.fn(),
      schema: {
        title: "Wow, what an amazing extension!",
      },
    },
    form: {
      formValueSubscribers: [],
      readOnlySubscribers: [],
      getValue: jest.fn(),
      onFormValueChange(fn: { (b: boolean): void }) {
        (this.formValueSubscribers as { (b: boolean): void }[]).push(fn);
      },
      onReadOnlyChange(fn: { (b: boolean): void }) {
        (this.readOnlySubscribers as { (b: boolean): void }[]).push(fn);
      },
    },
    frame: {
      startAutoResizer: jest.fn(),
    },
    params: {
      installation: {
        type: "description",
        sources: ["/content"],
      },
    },
    hub: {
      organizationId: "abc123",
    },
  } as T;

  return sdk;
};
