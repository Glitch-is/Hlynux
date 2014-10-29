var DisplayServer = {
    screen: null,
    height: document.body.clientWidth,
    width: document.body.clientHeight,

    init: function() {
        $("body").append("<div id='screen'></div>");
        this.screen = new Kinetic.Stage({
            container: "screen",
            width: this.width,
            height: this.height
        });
    },

    addWindow: function() {
        var lauer = new Kinetic.Layer();

        var wind = new Kinext.Rect({
            x: 100,
            y: 40,
            width: 100,
            height: 50,
            fill: 'black',
            stroke: '#00FF00',
            strokeWidth: 4,
            draggable: true
        });

        layer.add(wind);
        this.screen.add(layer);
    }
};
