const Error404 = {
  render: async () => {
    return /*html*/ `
      <section>
        <h1 class="text-center">Error 404. Page not found.</h1>
      </section>
    `;
  },

  after_render: async () => {},
};
export default Error404;
