//顏色陣列
var heroColor=new Array("#BA9658","#FEF26E");
var enemyColor=new Array("#00A2B5","#00FEFE");

//爆炸效果類別
function Bomb(x,y){
  this.x=x;
  this.y=y;
  this.isLive=true;
  //生命值
  this.blood=9;
  //減生命值
  this.bloodDown=function(){
    if(this.blood>0){
      this.blood--;
    }else{
	  this.isLive=false;
	}
  }
}

//子彈類別
//type表示子彈是敵人還是自己的
//tank表示對象 說明這顆子彈屬於哪個坦克
function Bullet(x,y,direct,speed,type,tank){
  this.x=x;
  this.y=y;
  this.direct=direct;
  this.speed=speed;
  this.type=type;
  this.tank=tank;
  this.timer=null;
  this.isLive=true;
  
  this.run=function run(){
    //判斷子彈是否已到邊界或碰到敵人坦克
	if(this.x<=0||this.x>=400||this.y<=0||this.y>=300||this.isLive==false){
	  //子彈停止
	  window.clearInterval(this.timer);
	  this.isLive=false;
	  if(this.type=="enemy"){
	    this.tank.bulletIsLive=false;
	  }
	} else {
      //修改座標
	  switch(this.direct){
	    case 0:
	      this.y-=this.speed;
	      break;
	    case 1:
	      this.x+=this.speed;
	      break;
        case 2:
	      this.y+=this.speed;
          break;
        case 3:
	      this.x-=this.speed;
          break;	  
	  }
	}
	//document.getElementById("data").innerText = "子彈x="+this.x+" 子彈y="+this.y;
  }
}

//定義Tank類別
function Tank(x,y,direct,color){
  this.x=x;
  this.y=y;
  this.speed=1;
  this.isLive=true;
  this.direct=direct;
  this.color=color;
  //上移
  this.moveUp=function(){
    this.y-=this.speed;
	this.direct=0;
  }
  //下移
  this.moveDown=function(){
	this.y+=this.speed;
	this.direct=2;
  }
  //右移
  this.moveRight=function(){
	this.x+=this.speed;
	this.direct=1;
  }
  //左移
  this.moveLeft=function(){
	this.x-=this.speed;
	this.direct=3;
  }
}
//定義一個hero類
function Hero(x,y,direct,color){
  //繼承
  this.tank=Tank;
  this.tank(x,y,direct,color);
  this.shot=function(){
    //創建子彈
	//this.x目前hero的x座標
	switch(this.direct){
	  case 0:
	    heroBullet=new Bullet(this.x+9,this.y,this.direct,1,"hero",this);
	  break;
	  case 1:
	    heroBullet=new Bullet(this.x+30,this.y+9,this.direct,1,"hero",this);
	  break;
	  case 2:
	    heroBullet=new Bullet(this.x+9,this.y+30,this.direct,1,"hero",this);
	  break;
	  case 3:
	    heroBullet=new Bullet(this.x,this.y+9,this.direct,1,"hero",this);
	  break;
	}
	//把子彈放到陣列
	heroBullets.push(heroBullet);
	
	//每個子彈的定時是獨立的
	var timer = window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()",50);
	heroBullets[heroBullets.length-1].timer=timer;
  }
}

//敵人坦克
function Enemy(x,y,direct,color){
  this.tank=Tank;
  this.tank(x,y,direct,color);
  this.count=0;
  this.bulletIsLive=true;

  this.run=function run(){
    //判斷敵人坦克目前的方向
	switch(this.direct){
	  case 0:
	    if(this.y>0){
          this.y-=this.speed;
        } 
	  break;
	  case 1:
	    if(this.x+30<400){
          this.x+=this.speed;
        }
	  break;
	  case 2:
	    if(this.y+30<300){
		  this.y+=this.speed;
		}
	  break;
	  case 3:
	    if(this.x>0){
		  this.x-=this.speed;
		}
	  break;
	}
	//改變方向 走30次再改變方向
	if(this.count>30){
	  //隨機生成0,1,2,3
	  this.direct=Math.round(Math.random()*3);
	  this.count=0;
	}
	this.count++;

	//判斷子彈是否死亡 如果死亡則增加一顆新的子彈
	if(this.bulletIsLive==false && this.isLive){
	  //增加子彈 考慮當前坦克的方向增加子彈
	  switch(this.direct){
	    case 0:
		  etBullet=new Bullet(this.x+9,this.y,this.direct,1,"enemy",this);
		break;
		case 1:
		  etBullet=new Bullet(this.x+30,this.y+9,this.direct,1,"enemy",this);
		break;
		case 2:
		  etBullet=new Bullet(this.x+9,this.y+30,this.direct,1,"enemy",this);
		break;
		case 3: //右
		  etBullet=new Bullet(this.x,this.y+9,this.direct,1,"enemy",this);
		break;
	  }
	  //把子彈增加到敵人子彈array中
	  enemyBullets.push(etBullet);
	  //啟動新子彈run
	  var mytimer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",50);
      enemyBullets[enemyBullets.length-1].timer=mytimer;
 
      this.bulletIsLive=true;
	}
  }
}

//畫出子彈
function drawBullet(){
  for(var i=0;i<heroBullets.length;i++){
    var heroBullet=heroBullets[i];
    if(heroBullet!=null&&heroBullet.isLive){
      cxt.fillStyle="#FEF26E";
      cxt.fillRect(heroBullet.x,heroBullet.y,2,2);
    }
  }
}
//畫出敵人子彈
function drawEnemyBullet(){
  for(var i=0;i<enemyBullets.length;i++){
    var enemyBullet=enemyBullets[i];
    if(enemyBullet.isLive){
      cxt.fillStyle="#00FEFE";
      cxt.fillRect(enemyBullet.x,enemyBullet.y,2,2);
    }
  }
}

//畫出坦克
function drawTank(tank){
  if(tank.isLive){
    //考慮方向
	switch(tank.direct){
	  case 0://上
	  case 2://下
        cxt.fillStyle = tank.color[0];
        cxt.fillRect(tank.x,tank.y,5,30);
        cxt.fillRect(tank.x+15,tank.y,5,30);
        cxt.fillRect(tank.x+6,tank.y+5,8,20);
        cxt.fillStyle = tank.color[1];
        cxt.arc(tank.x+10,tank.y+15,4,0,2*Math.PI,true);
        cxt.fill();
        cxt.strokeStyle=tank.color[1];
        cxt.lineWidth = 2;
        cxt.beginPath();
        cxt.moveTo(tank.x+10,tank.y+15);
	    if(tank.direct==0){
          cxt.lineTo(tank.x+10,tank.y);
	    }else if(tank.direct==2){
	      cxt.lineTo(tank.x+10,tank.y+30);
	    }
        cxt.closePath();
        cxt.stroke();
	  break;
	  case 1:
	  case 3:
	    cxt.fillStyle = tank.color[0];
        cxt.fillRect(tank.x,tank.y,30,5);
        cxt.fillRect(tank.x,tank.y+15,30,5);
		//中間矩形
        cxt.fillRect(tank.x+5,tank.y+6,20,8);
        cxt.fillStyle = tank.color[1];
        cxt.arc(tank.x+15,tank.y+10,4,0,2*Math.PI,true);
        cxt.fill();
        cxt.strokeStyle=tank.color[1];
        cxt.lineWidth = 2;
        cxt.beginPath();
        cxt.moveTo(tank.x+15,tank.y+10);
	    if(tank.direct==1){
          cxt.lineTo(tank.x+30,tank.y+10);
	    }else if(tank.direct==3){
	      cxt.lineTo(tank.x,tank.y+10);
	    }
        cxt.closePath();
        cxt.stroke();
	  break;
	}
  }
}

//判斷我的子彈是否擊中某一個敵人的坦克
function isHitEnemyTank(){
  //取出每顆子彈
  for(var i=0;i<heroBullets.length;i++){
    //取出一顆子彈
	var heroBullet=heroBullets[i];
	//子彈是活的才去判斷
	if(heroBullet.isLive){
	  //讓這顆子彈去和每個敵人判斷
	  for(var j=0;j<enemyTanks.length;j++){
	    var enemyTank=enemyTanks[j];
		if(enemyTank.isLive){
		  //子彈擊中敵人坦克的條件
		  //看看這顆子彈是否進入敵人坦克所在矩形
		  //根據當敵人坦克的方向來決定
		  switch(enemyTank.direct){
		    case 0://向上
			case 2://向下
			  if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+20
			    &&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+30){
				enemyTank.isLive=false;
				heroBullet.isLive=false;
				//創建一個爆炸效果
				var bomb=new Bomb(enemyTank.x,enemyTank.y);
				//放到array中
				bombs.push(bomb);
			  }
			break;
			case 1://向右
			case 3://向左
			  if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+30
				&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+20){
				enemyTank.isLive=false;
				heroBullet.isLive=false;
				//創建一個爆炸效果
				var bomb=new Bomb(enemyTank.x,enemyTank.y);
				//放到array中
				bombs.push(bomb);
			  }
			break;
		  }
		}
	  }
	}
  }
}

//畫出爆炸效果
function drawBomb(){
  for(var i=0;i<bombs.length;i++){
    //取出一顆炸彈
	bomb=bombs[i];
	if(bomb.isLive){
	  //根據當前炸彈的生命值 畫出不同的炸彈圖片
	  if(bomb.blod>6){
	    var img1=new Image();
		img1.src="bomb_1.gif";
		var x=bomb.x;
		var y=bomb.y;
		img1.onload=function(){
		  cxt.drawImage(img1,x,y,30,30);
		}
	  }else if(bomb.blood>3){
	    var img2=new Image();
		img2.src="bomb_2.gif";
		var x=bomb.x;
		var y=bomb.y;
		img2.onload=function(){
		  cxt.drawImage(img2,x,y,30,30);
		}
	  }else{
	    var img3=new Image();
		img3.src="bomb_3.gif";
		var x=bomb.x;
		var y=bomb.y;
		img3.onload=function(){
		  cxt.drawImage(img3,x,y,30,30);
		}
	  }
	  //減血
	  bomb.bloodDown();
	  if(bomb.blood<=0){
	    //把炸彈從array中去掉
		bombs.splice(i,1);
	  }
	}
  }
}

//判斷敵人的子彈是否擊中自己的坦克
function isHitHeroTank(){
  for(var i=0;i<enemyBullets.length;i++){
    if(enemyBullets[i].isLive && hero.isLive){
	  switch(hero.direct){
	    case 0:
		case 2:
		  if(enemyBullets[i].x >= hero.x && enemyBullets[i].x <= hero.x+20 && enemyBullets[i].y >= hero.y && enemyBullets[i].y <= hero.y +30){
		    hero.isLive=false;
			enemyBullets[i].isLive=false;
			var bomb = new Bomb(hero.x,hero.y);
			bombs.push(bomb);
		  }
		break;
		case 1:
		case 3:
		  if(enemyBullets[i].x >= hero.x && enemyBullets[i].x <= hero.x+30 && enemyBullets[i].y >= hero.y && enemyBullets[i].y <= hero.y +20){
		    hero.isLive=false;
			enemyBullets[i].isLive = false;
			var bomb = new Bomb(hero.x,hero.y);
			bombs.push(bomb);
		  }
		break;
	  }
	}
  }
}