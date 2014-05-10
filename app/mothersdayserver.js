

var express = require("express"),
    path = require("path"),
    fs = require("fs"),
    http = require("http");



module.exports.MothersDayServer = (function (express) {



    var app = express();


    app.root = __dirname+'/../';
    app.staticRoot = "dev/";
    app.fileSuffix = "";




    app.data = require(app.root+"package.json");
    app.cdnRoot = app.data.deploy.dev.cdn_root;


    app.set('views', path.normalize(app.root+"views"));
    app.set('view engine', 'ejs');

    app.set('port'  , process.env.PORT || app.data.dev.port);


    console.log(app.get("port"));



    if(process.env.NODE_ENV === "staging") {
        app.use(express.basicAuth(process.env.USER, process.env.PASSWORD));
        app.staticRoot = "dist/";
        app.fileSuffix = "min.";
        app.cdnRoot = app.data.deploy.prod.cdn_root;
    }

    if(process.env.NODE_ENV === "production") {
        app.staticRoot = "dist/";
        app.fileSuffix = "min.";
        app.cdnRoot = app.data.deploy.prod.cdn_root;
    }

    app.deploy = path.normalize(app.root + app.staticRoot);

    app.onListen = function () {
        console.log("running on port %d" , app.get("port"));
        this.initRoutes();
    };

    app.onError = function () {

    };

    app.initRoutes = function () {

        this.get("/:r" , this.index );



        this.use(express.static(this.deploy));
    };

    app.index = function (req,res) {

        var dataPath = path.normalize(app.root+'src/data/'+ req.params.r + ".json");

        try{
            var recipientData = require(dataPath);

            res.render('index', {
                name: app.data.name,
                suffix:app.fileSuffix,
                recipient: recipientData,
                cdn_root:app.cdnRoot

            });
        }catch(e) {
            res.send(404, "Recipient Not Found");
        }

    };

    //rebind functions
    app.index = app.index.bind(app);
    app.onListen = app.onListen.bind(app);






    app.server = app.listen(app.get("port"), app.onListen );




    return app;



}(express));







