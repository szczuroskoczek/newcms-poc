export default {
  items: {
    type: "array",
    of: {
      type: "object",
      props: {
        title: {
          type: "text",
        },
        url: {
          type: "text",
        },
      },
    },
  },
};
