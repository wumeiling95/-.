var ImgFigure = React.createClass({
    clickHandler:function () {
        if(this.props.data.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
    },
    render:function(){
        var styleObj = {
            left:this.props.data.pos.x,
            top:this.props.data.pos.y,
            transform : "rotate(" + this.props.data.rotate + "deg)",
            isCenter:this.props.data.isCenter,
            isInverse:this.props.data.isInverse
        };
        if(this.props.data.isInverse){
            styleObj.transform  = "rotateY(180deg)";
        }
        return (
            <figure className="img-figure" style={styleObj} onClick={this.clickHandler}>
                <img src={"img/"+this.props.info.fileName} />
                <figcaption>
                   <h2>{this.props.info.title}</h2>
                   <div>{this.props.info.desc}</div>
                </figcaption>
            </figure>
        );
    }
});
var Controller = React.createClass({
    clickHandler:function () {
        if(this.props.data.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
    },
    render:function(){
        var ctrlClassName = "controller";
        if(this.props.data.isCenter){
            ctrlClassName += " is-center";
            if(this.props.data.isInverse){
                ctrlClassName += " is-inverse";
            }
        }
        return (
           <span className={ctrlClassName} onClick={this.clickHandler}></span>
        );
    }
});
var Photowall = React.createClass({
    getInitialState:function(){
        return{
            imgInfoArr:[{
                    pos:{
                        x:0,
                        y:0
                    },
                    rotate:0,
                    isCenter:false,
                    isInverse:false
                }]
        };
    },
    const:{
       centerPos:{
           x: 0,
           y: 0
       },
        xLeftMax:0 ,
        xLeftMin:0 ,
        xRightMax:0 ,
        xRightMin:0 ,
        xTopMin:0 ,
        xTopMax:0
    },
    componentDidMount:function () {
      var stageDOM = this.refs.stage;
      var wStageDOM =stageDOM.offsetWidth;
      var hStageDOM = stageDOM.offsetHeight;
      var wHalfStageDOM =wStageDOM/2;
      var hHalfStageDOM = hStageDOM/2;
      var imgFigure = ReactDOM.findDOMNode(this.refs.imgFigure);
      var wImgFigure = imgFigure.offsetWidth;
      var hImgFigure = imgFigure.offsetHeight;
      var wHalfImgFigure = wImgFigure/2;
      var hHalfImgFigure = hImgFigure/2;
    //计算图片范围
        this.const={
            centerPos:{
                x:wHalfStageDOM - wHalfImgFigure,
                y:hHalfStageDOM - hHalfImgFigure
            },
                xLeftMax: wHalfStageDOM - 3*wHalfImgFigure ,
                xLeftMin: -wHalfImgFigure ,
                xRightMax:wStageDOM - wHalfImgFigure ,
                xRightMin: wHalfStageDOM + wHalfImgFigure ,
                xTopMin: -hHalfImgFigure,
                xTopMax:hStageDOM - hHalfImgFigure
        };
        this.rearrage(0); //默认第一张图片居中
    },
    //中间的图片居中
    rearrage:function (centerIdx) {
       var imgInfoArr = this.state.imgInfoArr;
       for(var i=0;i<imgInfoArr.length;i++){
              if(i < imgInfoArr.length/2){
                  imgInfoArr[i].pos = {
                      x:getRandom(this.const.xLeftMin,this.const.xLeftMax),
                      y:getRandom(this.const.xTopMin,this.const.xTopMax)
                  };
              }else{
                  imgInfoArr[i].pos = {
                      x:getRandom(this.const.xRightMin,this.const.xRightMax),
                      y:getRandom(this.const.xTopMin,this.const.xTopMax)
                  };
              }
           imgInfoArr[i].rotate = getRandom(-30,30);
           imgInfoArr[i].isCenter = false;
           imgInfoArr[i].isInverse = false;
       }
        imgInfoArr[centerIdx].pos = {
            x : this.const.centerPos.x,
            y : this.const.centerPos.y
        };
        imgInfoArr[centerIdx].rotate = 0;
        imgInfoArr[centerIdx].isCenter = true;
        this.setState({
            imgInfoArr : imgInfoArr
        });
    },
    center:function (index) {
        return function (index) {
            this.rearrage(index);
        }.bind(this,index)
    },
    inverse:function (index) {
        return function (index) {
            this.state.imgInfoArr[index].isInverse = !this.state.imgInfoArr[index].isInverse;
            this.setState({
                imgInfoArr:this.state.imgInfoArr
           });
        }.bind(this,index);

    },
    render:function(){
        var imgFigureArr = [];
        var controllerArr = [];
          imgDatas.forEach(function(value,index,arr){
              //图片位置初始化
              if(!this.state.imgInfoArr[index]){
                  this.state.imgInfoArr[index] = {
                      pos:{
                          x:0,
                          y:0
                      },
                      rotate:0,
                      isCenter:false,
                      isInverse:false
                  };
              }
             imgFigureArr.push(<ImgFigure key={index} info={value}
             data={this.state.imgInfoArr[index]} ref="imgFigure"
              center={this.center(index)} inverse={this.inverse(index)}/>);
              controllerArr.push(<Controller key={index}  data={this.state.imgInfoArr[index]}
              center={this.center(index)} inverse={this.inverse(index)}/>);
        }.bind(this));
        return (
              <section className="stage" ref="stage">
                <section>
                    {imgFigureArr}
                </section>
                <section className="nav">
                    {controllerArr}
                </section>
              </section>
        );
    }
});
ReactDOM.render(
   <Photowall />,
    document.getElementById('photowall')
);
function getRandom(low,high) {
    return Math.ceil(Math.random()*(high-low) + low);
}
