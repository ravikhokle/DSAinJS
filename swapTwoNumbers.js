let a=10;
let b=20;

// using third variable
// let c;
// c=a;
// a=b;
// b=c;

// without using third variable
// a = a+b; // 30
// b = a-b; // 10
// a = a-b; // 20

// using destructuring
[a,b] = [b,a];


console.log(a);
console.log(b);






