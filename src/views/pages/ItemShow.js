import { parseRequestUrl } from "../../services/utils.js";
import { Component } from "../../utils/component";

export class ItemShow extends Component {
  getItem = async (id) => {
    return {
      name: "lol",
      img: "",
      char_id: id,
    };
  };

  render = async () => {
    // Get current URL params.
    const params = parseRequestUrl();
    // Get destructured data from API based on id provided.
    const { name, nickname, img, birthday, portrayed } = await getItem(
      params.id
    );
    return /*html*/ `
      <section class="container-md" style="width: 20rem;">
        <div class="card">
          <img src=${img} class="card-img-top" alt=${name} id="characterImage">
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">Known as ${nickname}.</p>
            <p class="card-text">Birthday ${birthday}.</p>
            <p class="card-text">Played by ${portrayed}.</p>
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
