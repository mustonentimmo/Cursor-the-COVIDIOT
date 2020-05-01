$(document).ready(function() {



 // circles default properties

  let radius;
  let amount;
  let blackRadius = 40
  
  var context = document.querySelector("canvas").getContext("2d");
  var circles = new Array();
  let x = document.documentElement.clientWidth;
  let y = document.documentElement.clientHeight;
  context.canvas.style.display = "none";

  const Circle = function(x, y, radius) {

      this.direction = Math.random() * 1000;
      this.colliding = false;
      this.radius = radius;
      this.speed = Math.random() * 3 + 1;
      this.x = 0;
      this.y = 310;

  };

  $('.button').on('click', function(){
    amount = $('.input').val();

     // set default value 

    if(amount == '') {
      
      amount = 5

    }
      
    // scale circles radius according to the input value
     
    if(amount >= 60) {
      alert('Hold your horses, this may cause your browser to slow down!')
      radius = 10;
    } else if(amount >= 40) {
      radius = 15;
    } else if(amount >= 20) {
      radius = 20;
    } else {
      radius = 25;
    }

    

    // Set spawn interval time 

    let x = 1000

      if(amount > 10) {
        x = 500
      }

      
      function generate() {
        for(i = 0; i < amount; i++) {
      
          task(i)

        }
      }
      
      function task(i) { 
        setTimeout(function() { 
          circles.push(new Circle(x, y, radius))
        }, x * i); 

      } 


    // toggle UI elements
    
    $('.inputPanel').toggle()
    $('.gameCanvas').toggle()
    $('.reset').toggle()


    for (let i = 0; i < 8; i++) {
      $('.gameHeaders').fadeToggle('slow')
    }

    // time counter
    var time = setInterval(timeFunction, 1000)
    let sec = 0
    
    function timeFunction() {
      sec++
      if(jQuery.isEmptyObject(circles)) {
        clearInterval(time)
        $('.time').html('Your time: ' + sec + ' seconds')
      }
    } 


    $.when($.ajax(generate())).then(function () {

    loop()
  
  });
    
  
  })



                                                    
 //  Game 

  function loop(time) {

    window.requestAnimationFrame(loop);

    let height = $('.application').height();
    let width  = $('.application').width();

    context.canvas.height = height;
    context.canvas.width = width;

  

    for(let i = 0; i < circles.length; i ++) {

      let circle = circles[i];

      // Circle
      context.beginPath();
      context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      context.fillStyle = '#333366';
      context.fill();
      context.closePath();

      // BlackCircle
      context.beginPath();
      context.arc(1000, 300, blackRadius, 0, Math.PI * 2);
      context.fillStyle = 'black';
      context.fill();
      context.closePath();

      if(circle.colliding) {

        context.fillStyle = '#eb4d55';
        circle.speed = 20;
        circle.colliding = false;

        setTimeout(function(){
            
            circle.direction = circle.direction * -1
          
        }, 2000)
      } else {

        circle.speed = 5

      }
    

      circle.updatePosition(width, height);
  
    }


    //  Check Collisions 

    cursorIntersec()
    circlesIntersec()
    blackCircle()

    // Check if array is empty

    if(jQuery.isEmptyObject(circles)) {
    
      context.canvas.style.display = "none";
      
      $('.gameOver').fadeToggle('slow')
      
      return;
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////// COLLISION CHECKING FUNCTIONS ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
 
 
 /////////////////////////////////////// 1.1 Check collision with canvas wall ///////////////////////////////////////////////
 
 Circle.prototype = {

  updatePosition:function(width, height) {

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    if(this.x - this.radius < 0) {

      this.x = this.radius;

      this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * -1);

    } else if (this.x + this.radius > width) {

      this.x = width - this.radius;

      this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * -1);

    }

    if(this.y - this.radius < 0) {

      this.y = this.radius;

      this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));

    } else if (this.y + this.radius > height) {

      this.y = height - this.radius;

      this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));

    }


  }

  };

 //////////////////////////////////////////// 1.2 Check collisons with cursor  ///////////////////////////////////////////////////

  function cursorIntersec() {
   

    if($('.gameCanvas').css('display','block')){

      $('.gameCanvas').mousemove(function(e) { 

        var cRect = context.canvas.getBoundingClientRect();       
        var mouseX = Math.round(e.clientX - cRect.left);  
        var mouseY = Math.round(e.clientY - cRect.top); 

        context.clearRect(0, 0, context.canvas.width, context.canvas.height); 

        return changePos(mouseX, mouseY) 
      });

      function compare(mouseX, mouseY, circleX, circleY, circleRadius) {
          

          let distance=Math.sqrt((mouseX-circleX)*(mouseX-circleX) + (mouseY-circleY)*(mouseY-circleY))
          
        
          if(distance - 100 <= circleRadius) {
            return true

          }

          return false
      }

      function changePos(mouseX, mouseY) {
        for(i=0; i < circles.length;i++){
          
          let circle = circles[i]
        

          if(compare(mouseX, mouseY, circle.x, circle.y, circle.radius)) {
            circle.colliding = true;

          

          } 
        
        }
        
  
      }

    

    }
  }

  //////////////////////////////////////////// 1.3  Check collisons between circles  ///////////////////////////////////////////////////


  function circlesIntersec(speed) {

    function checkIntersect(x1, y1, r1, x2, y2, r2) {
  
      let circlesDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
  
      let twoMeterRuleByJüriRatas = (r1 + r2) * (r1 + r2) + 200;
  
      if(circlesDistance-twoMeterRuleByJüriRatas <= (r1 + r2) * (r1 + r2)) {
        return true
      }
      
    }
  
    // Give circles new direction 🚀 
  
    
    for (let i = 0; i < circles.length; i++) {
      
        let circles1 = circles[i];
  
      for (let j = i + 1; j < circles.length; j++) {
              
        let circles2 = circles[j];


  
        // Compare circle1 with circle2
        if (checkIntersect(circles1.x, circles1.y, circles1.radius, circles2.x, circles2.y, circles2.radius)){

            var dx = circles2.x - circles1.x;
            var dy = circles2.y - circles1.y;
                
            var vectorLength = Math.sqrt(dx*dx + dy*dy);

            var step = circles1.radius + circles2.radius - vectorLength + 20

                
            if (step > 0) {
                   
                 dx /= vectorLength; dy /= vectorLength;
                
                    
                circles1.x -= dx*step/2; circles1.y -= dy*step/2;
                circles2.x += dx*step/2; circles2.y += dy*step/2; 
            }
  
        } 
              
      }
      
    }
  
       
  }

  //////////////////////////////////////////// 1.4  Check collisons between Black circle  ///////////////////////////////////////////////////

  function blackCircle() {

      // Check if hard mode is enabled
    
    if($(".hardMode").prop('checked') == true){
     
      blackRadius = 5

    }

      for (let i = 0; i < circles.length; i++) {

        const circle = circles[i];
        const darkCircle = {
          x: 1000,
          y: 300,
          radius: blackRadius
        }

        function checkIntersect(x1, y1, r1, x2, y2, r2) {
  
          let circlesDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

      
          let r = (r1 + r2) * (r1 + r2);

      
          if(circlesDistance - 500 <= (r1 + r2) * (r1 + r2)) {
            return true
          }
          
        }

        if (checkIntersect(darkCircle.x, darkCircle.y, darkCircle.radius, circle.x, circle.y, circle.radius)){
          
          circles.splice(i, 1)
        }
        
      }
  }


})

