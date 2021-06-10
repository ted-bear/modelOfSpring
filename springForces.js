window.addEventListener('load', main, false);
function main(){
	var ctx = canvas.getContext('2d');
	var ctxS = canvas_s.getContext('2d');
	var ctxT = canvas_t.getContext('2d');
	var h = canvas.height;
	var w = canvas.width;
	var hS = canvas_s.height;
	var wS = canvas_s.width;
	var scaleX = wS / w;
	var scaleY = hS / h;
	var dt = 0.01; // Шаг по времени
	var r = 20; // радиус груза
	var betta = -0.3;
	var gravity = 9.8;
	var k = parseInt(rigidity.value); // Жесткость пружины
	var isDrag = false;
	var timer;
	
	function Ball(mass, x, y, r, vx, vy, ax, ay, clr){
		var that = this;
		this.mass = mass;
		this.x = x;
		this.y = y;
		this.r = r;
		this.vx = vx;
		this.vy = vy;
		this.ax = ax;
		this.ay = ay;
		this.clr = clr;
		
		this.draw = function(ctx){
			ctx.clearRect(0, 0, w, h);
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.moveTo(w/2, 0);
			ctx.lineTo(ball.x, ball.y);
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = that.clr;
			ctx.strokeStyle = 'black';
			ctx.arc(that.x, that.y, that.r, 0, Math.PI*2);
			ctx.fill();
			ctx.arc(that.x, that.y, that.r + 1, 0, Math.PI*2);
			ctx.stroke();
		}
	}
	
	function axis()	{ // функция для осей
		ctxS.beginPath(); 
		ctxS.moveTo(0, 0.5*hS);
		ctxS.lineTo(wS, 0.5*hS);
		ctxS.moveTo(wS/2, 0);
		ctxS.lineTo(wS/2, hS);
		ctxS.stroke();
		
		ctxT.beginPath(); 
		ctxT.moveTo(0, 0.5*hS);
		ctxT.lineTo(wS, 0.5*hS);
		ctxT.moveTo(wS/2, 0);
		ctxT.lineTo(wS/2, hS);
		ctxT.stroke();
	}
	
	function get_mouse_coords(e){
		var m = {}; // обозначаем объект
		var rect = canvas.getBoundingClientRect();
		m.x = e.clientX - rect.left; // добавляем свойство для объекта m
		m.y = e.clientY - rect.top;
		console.log(m.x, m.y,);
		return m;
	}
	
	var ball = new Ball(parseInt(mass.value), w/2, h/2, r, 0, 0, 0, 0, '#2dc5f4');

	
	function phys(){
		
		ctxS.moveTo(ball.x * scaleX, ball.vx * scaleY+ hS/2);
		ctxT.moveTo(ball.y * scaleX, ball.vy * scaleY+ hS/2);
		var gip = Math.sqrt(Math.pow(Math.abs(w/2 - ball.x), 2) + Math.pow(ball.y, 2));
		var Fy = - k * (gip - h/2) * (ball.y/gip) + ball.mass * gravity   ;
		ball.vy += (Fy+ betta * ball.vy) * dt;
		
		
		var Fx;
		
		if (ball.x > w / 2){
			Fx = - k * (w/2 - ball.x) * (w/2 - ball.x) / gip;
		} else {
			Fx = - k * (ball.x - w/2) * (w/2 - ball.x) / gip;
		}
		
		ball.vx += (Fx+ betta * ball.vx) * dt;
		//velocityX.push(ball.vx);
		
		
		ball.x += ball.vx*dt;
		ball.y += ball.vy*dt;
		//coorX.push(ball.x);
		//coorY.push(ball.y);
		
		
		if(ball.x < ball.r){
			ball.vx *= -1;
			ball.x = ball.r;
		}
		if(ball.x > w - ball.r){
			ball.vx *= -1;
			ball.x = w - ball.r;
		}
		if(ball.y < ball.r){
			ball.vy *= -1;
			ball.y = ball.r;
		}
		if(ball.y > h - ball.r){
			ball.vy *= -1;
			ball.y = h - ball.r;
		}
		
		
		
	}
	
	function draw()
	{
		ctx.clearRect(0, 0, w, h);
		ball.draw(ctx);
		
		ctxS.lineTo(ball.x * scaleX, ball.vx * scaleY + hS / 2);
		ctxS.stroke();
		ctxT.lineTo(ball.y * scaleX, ball.vy * scaleY + hS / 2);
		ctxT.stroke();
	}
	
	draw();
	axis();
	
	function control()
	{
		phys();
		draw();
	}
	
	canvas.onmousedown = function(e)
	{
		var m = get_mouse_coords(e);
		if(Math.pow(ball.x - m.x, 2) + Math.pow(ball.y - m.y, 2) <= r*r)
		{
			p1 = {x: ball.x, y: ball.y}
			isDrag = true;
		}
		ctxS.clearRect(0, 0, wS, hS);
		ctxT.clearRect(0, 0, wS, hS);
		axis();
		
	}
	
	
	
	canvas.onmousemove = function(e)
	{
		var m = get_mouse_coords(e);
		if(m.x < ball.r || m.x > w - ball.r || m.y < ball.r || m.y > h - ball.r)
		{
			
			return false
		}
		if (isDrag)
		{
			ball.x = m.x;
			ball.y = m.y;
			ball.draw(ctx);
		}
		
	}
	
	canvas.onmouseup = function(e)
	{
		var m = get_mouse_coords(e);
		if(isDrag)
		{
			isDrag = false;
			ctxS.beginPath();
			ctxS.moveTo(0, 0);
			ctxT.beginPath();
			ctxT.moveTo(wS/2, hS/2);
			timer = setInterval(control, 1000/60);
			
		}
	}
}