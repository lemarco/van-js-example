import { Component } from "../../utils/component";

export class Items extends Component {
  getItems = async () => {
    return [
      {
        name: "lol",
        char_id: 1,
      },
      {
        name: "lol",
        char_id: 2,
      },
    ];
  };

  render = async () => {
    const items = await this.getItems();
    const itemList = items
      .map(
        ({ name, img, char_id }) => /*html*/ `
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="card mb-3" style="width: 13rem;">
            <a href="/#/items/${char_id}">
              <img src=${img} class="card-img-top" alt=${name}>
            </a>
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
            </div>
          </div>
        </div>
      `
      )
      .join("\n");
    return `
      <section class="container-md">
        <h1 class="text-center">List of items:</h1>
        <div class="row m-4">
          ${itemList}
        </div>
      </section>  
    `;
  };
}
