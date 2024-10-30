import { parseRequestUrl } from "../../services/utils.js";
import { Component } from "../../utils/component";

export class ItemShow extends Component {
  getItem = async (id) => {
    return {
      name: "lol",

      char_id: id,
    };
  };

  render = async () => {
    const params = parseRequestUrl();
    const { name } = await getItem(params.id);
    return `
      <section class="container-md" style="width: 20rem;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <a href="/#/items" class="btn btn-dark">Go Back</a>
          </div>
        </div>
      </section>
    `;
  };

  after_render = async () => {
    document
      .querySelector("#characterImage")
      .addEventListener("click", () => alert("You have clicked on the photo!"));
  };
}
