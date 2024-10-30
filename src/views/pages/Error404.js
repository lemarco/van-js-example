import { Component } from "../../utils/component";
export class Error404 extends Component {
  render = async () => {
    return /*html*/ `
      <section>
        <h1 class="text-center">Error 404. Page not found.</h1>
      </section>
    `;
  };
}
