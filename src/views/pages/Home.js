import { Component } from "../../utils/component";

export class Home extends Component {
  render = async () => {
    return /*html*/ `
      <section>
        <h1 class="text-bold text-red-300 ml-10" ><a href="/#/items">Check lol out all the characters from Breaking Bad!</a></h1>
      </section>
      <button id='send-event-btn' class="text-blue-800 border-2 m-4 p-2">press me to check reactivity</button>
    `;
  };

  after_render = async () => {
    const sendPizzaEvent = () => {
      window.dispatchEvent(
        new CustomEvent("lol-1-event", {
          detail: {
            name: "lol-1",
          },
        })
      );
    };
    document
      .querySelector("#send-event-btn")
      .addEventListener("click", sendPizzaEvent);
  };
}
