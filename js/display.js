var DisplayServer = {
    screen: null,
    height: document.body.clientWidth,
    width: document.body.clientHeight,

    init: function() {
        $("body").append("<div id='screen'></div>");

        this.screen = new Kinetic.Stage({
            container: "screen",
            width: window.innerWidth,
            height: window.innerHeight
        });


        this.addWindow();
    },

    addWindow: function() {
        var layer = new Kinetic.Layer({
            draggable: true
        });

        var wind = new Kinetic.Rect({
            x: 100,
            y: 40,
            width: 500,
            height: 300,
            fill: 'black',
            stroke: '#00FF00',
            strokeWidth: 1,
        });

        var bar = new Kinetic.Rect({
            x: wind.getX(),
            y: wind.getY(),
            width: wind.getWidth(),
            height: 20,
            fill: 'black',
            stroke: '#00FF00',
            strokeWidth: 1,
        });

        var close = new Kinetic.Text({
            x: wind.getX() + wind.getWidth() - 14,
            y: wind.getY() + 3,
            text: 'X',
            fontSize: 14,
            fill: '#00FF00'
        });

        var text = new Kinetic.Text({
            x: wind.getX() + 2,
            y: wind.getY() + 22,
            text: 'Hlynux',
            fontSize: 24,
            fill: '#00FF00'
        });

        layer.add(wind);
        layer.add(bar);
        layer.add(close);
        layer.add(text);
        this.screen.add(layer);
    }
};

window.onresize = function(event) {
    DisplayServer.screen.setWidth(window.innerWidth);
    DisplayServer.screen.setHeight(window.innerHeight);
};
