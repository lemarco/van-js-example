const Footer = {
  render: async () => {
    return /*html*/ `
      <p class="text-center mt-4"><em>Single Page App built with Vanilla JavaScript.</em></p>  
      <p id='event-handler-p'></p>
      <p class="text-center "><em id="time"></em></p>  
    `;
  },

  after_render: async () => {
    const time = document.querySelector("#time");
    const p = document.querySelector("#event-handler-p");
    window.addEventListener("lol-1-event", (e) => {
      p.innerHTML = e.detail.name;
    });

    const updateTime = () => {
      const newDate = new Date();
      const clock = newDate.toTimeString().slice(0, 8);
      const date = newDate.toLocaleDateString().slice(0, 8);

      time.innerHTML = `${clock} ${date}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  },
};

export default Footer;
