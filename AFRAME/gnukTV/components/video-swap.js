AFRAME.registerComponent("video-swap", {
  schema: {
    jsonData: {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
  },
  dependencies: ["material"],

  init: function () {
    this.el.setAttribute(
      "video-swap",
      "jsonData",
      url("../assets/videos.json")
    );
    console.log(this.data.jsonData);
    this.currentID = 0;
    this.onClick = this.onClick.bind(this);
    this.update();
  },
  play: function () {
    window.addEventListener("click", this.onClick);
  },
  onClick: function (evt) {
    const videoMaterial = this.el.getAttribute("material").src;
    const vidTitle = this.data.jsonData[this.currentID].title;
    const videoSrc = this.data.jsonData[this.currentID].id;
    const boxArtSrc = this.data.jsonData[this.currentID].thumb;

    if (videoSrc) {
      videoMaterial.src = videoSrc;
      this.el.object3D.visible = true;
      videoMaterial.play();
      this.currentID = (this.currentID + 1) % this.data.length;
      console.log("Video Source: ", videoSrc);
      console.log("Video ID: ", this.currentID);
    }
    // if (boxArtSrc) {
    //   this.el.setAttribute("material", "src", boxArtSrc);
    // }
  },

  remove: function () {
    // Do something when the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  },
});
