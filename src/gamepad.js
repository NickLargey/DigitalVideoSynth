class Gamepad {
  constructor() {
    window.addEventListener("gamepadconnected", (e) => {
      this.gp = navigator.getGamepads()[e.gamepad.index];
      console.log(
        `Gamepad connected at index ${gp.index}: ${gp.id} with ${gp.buttons.length} buttons, ${gp.axes.length} axes.`
      );
    });
  }
}
