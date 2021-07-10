class Cylinder extends Objeto3D{
    constructor(n,m,height,radius){
        super(n,m);
        this.height = height;
        this.radius = radius;

    }

    getPos(alfa,beta){
        var r = this.radius;
        var h = this.height;
        var x=r*Math.cos(alfa);
        var y=beta*h;
        var z=r*Math.sin(alfa);
        return [x,y,z];
    }

    getNrm(alfa,beta){
        var p=this.getPos(alfa,beta);
        var v=vec3.create();
        vec3.normalize(v,p);
    
        var delta=0.05;
        var p1=this.getPos(alfa,beta);
        var p2=this.getPos(alfa,beta+delta);
        var p3=this.getPos(alfa+delta,beta);
    
        var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
        var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
    
        vec3.normalize(v1,v1);
        vec3.normalize(v2,v2);
        
        var n=vec3.create();
        vec3.cross(n,v1,v2);
        vec3.scale(n,n,-1);
        return n;
    }

    setupBuffers(){
        var pos=[];
        var normal=[];

        for (var i=0;i<this.rows;i++){
            for (var j=0;j<this.cols;j++){
                var alfa=j/(this.cols-1)*Math.PI*2;
                var beta=(0.1+i/(this.rows-1)*0.8);
                var p=this.getPos(alfa,beta);
                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);
                var n=this.getNrm(alfa,beta);
                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);
            }
        }

        this.trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    


        this.trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
        var index=[];
        for (var i=0;i<this.rows-1;i++){
            index.push(i*this.cols);
            for (var j=0;j<this.cols-1;j++){
                index.push(i*this.cols+j);
                index.push((i+1)*this.cols+j);
                index.push(i*this.cols+j+1);
                index.push((i+1)*this.cols+j+1);
            }
            index.push((i+1)*this.cols+this.cols-1);
        }

        this.trianglesIndexBuffer = gl.createBuffer();
        this.trianglesIndexBuffer.number_vertex_point = index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);    
    }
}