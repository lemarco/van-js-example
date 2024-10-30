import { Component } from "../../utils/component";
export class Navbar extends Component {
  links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Register", path: "/register" },
    { name: "Table", path: "/table" },
    { name: "Secret", path: "/secret" },
  ];
  render = async () => {
    const navLinks = this.links
      .map(
        (link) =>
          /*html*/ `<li class="m-2"><a class="nav-link" href="/#${link.path}">${link.name}</a></li>`
      )
      .join("\n");
    return `
      <nav class="navbar navbar-expand-md navbar-light bg-white">
        <ul class="flex">${navLinks}</ul>
      </nav>
  `;
  };
}
