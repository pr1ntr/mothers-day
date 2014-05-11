
var __hasProp = {}.hasOwnProperty,
__extends = function(child, parent) { 
    for (var key in parent) { 
        if (__hasProp.call(parent, key)) 
            child[key] = parent[key]; 
    } 
    function ctor() { 
        this.constructor = child; 
    } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor(); 
    child.__super__ = parent.prototype; 
    return child; 
};



/*


*/

(function () {

    CardPull = (function (_super) {
        __extends(CardPull, _super);
        function CardPull(opts) {
            CardPull.__super__.constructor.apply(this,arguments);

            this.onHandleDown = this.onHandleDown.bind(this);
            this.onHandleUp = this.onHandleUp.bind(this);
            this.onHandleMove = this.onHandleMove.bind(this);

            this.$handle = $('#card-handle');
            this.$card = $('.envelope.contents');

            this.down = false;
            this.pullOffset = 0;

            this.init();



        }


        CardPull.prototype.init = function () {

            this.$handle.on('mousedown' , this.onHandleDown);
            $(document).on('mouseup' , this.onHandleUp);
            $(document).on('mousemove' , this.onHandleMove);

        };

        CardPull.prototype.onHandleDown = function (e) {
            this.down = true;
            TweenMax.killTweensOf(this.$card);
            this.pullOffset = parseInt(this.$handle.css("top")) + e.offsetY;
        };

        CardPull.prototype.onHandleUp = function () {
            this.down = false;

            switch(this.direction) {
                case "up" :
                    this.snapUp();
                    break;
                case "down" :
                    this.snapDown();
                    break;
            }
        };

        CardPull.prototype.onHandleMove = function (e) {
            if(this.down) {

                var mouseY= this.mouseY = e.pageY;

                var offsetY = this.$card.parent().offset().top;
                var cardY = parseInt(this.$card.css("top"));
                var top = this.top = mouseY - offsetY -  this.pullOffset;
                if(top < 285 && top >= 25) {
                    this.$card.css({
                        top:top
                    });
                }

                if(this.mouseYLast > this.mouseY)
                    this.direction = "up";
                else
                    this.direction = "down";

                this.mouseYLast = mouseY;



            }

        };

        CardPull.prototype.snapUp = function () {
            if(parseInt(this.$card.css("top")) !== 25 ) {
                TweenMax.to(this.$card, 1, {
                    top: 25,
                    ease: Cubic.easeOut,
                    overwrite:"all"
                });
            }
        };

        CardPull.prototype.snapDown = function () {
            if(parseInt(this.$card.css("top")) !== 285) {
                TweenMax.to(this.$card ,1 , {
                    top:285,
                    ease:Cubic.easeOut,
                    overwrite:"all"
                });
            }

        };


            return CardPull;

    })(Base);



}).call(window);




$(document).ready(function() {
    var cardpull = new CardPull();
});
