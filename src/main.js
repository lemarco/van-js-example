import Home from "./views/pages/Home.js";
import About from "./views/pages/About.js";
import Items from "./views/pages/Items.js";
import ItemShow from "./views/pages/ItemShow.js";
import Register from "./views/pages/Register.js";
import Error404 from "./views/pages/Error404.js";
import Navbar from "./views/components/Navbar.js";
import Footer from "./views/components/Footer.js";
import { parseRequestUrl } from "./services/utils.js";
import "./index.css";

const routes = {
  "/": Home,
  "/about": About,
  "/items": Items,
  "/items/:id": ItemShow,
  "/register": Register,
};

const router = async () => {
  const header = null || document.getElementById("header_root");
  const content = null || document.getElementById("page_root");
  const footer = null || document.getElementById("footer_root");

  header.innerHTML = await Navbar.render();
  await Navbar.after_render();
  footer.innerHTML = await Footer.render();
  await Footer.after_render();

  const { resource, id, verb } = parseRequestUrl();

  const parsedUrl =
    (resource ? "/" + resource : "/") +
    (id ? "/:id" : "") +
    (verb ? "/" + verb : "");

  const page = routes[parsedUrl] || Error404;
  content.innerHTML = await page.render();
  await page.after_render();
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
