// function fruit(){
//     name = "Ravi"; // hoisting concept
//     console.log(name);
//     var name = "Sandip";
//     console.log(name)
// }
// fruit();

// for(var i=0; i<=4; i++){
//     setTimeout(()=> console.log(i));
// }
// output will be break codition+1 here 4 + 1 = 5 and this print break condition + 1 times. because var has globle scope and setTimeout take some time to run while loop have completed.

// for(let i=0; i<=3; i++){
//     setTimeout(()=> console.log(i));
// }
// here output will be 0,1,2,3 because let has block scope

// console.warn(+true);    //output 1
// console.warn(typeof + true); // output number

// console.log(!"Ravi");            // false
// console.log(!!"Ravi");           //true
// console.log(typeof("Ravi"));     // string

// let data = "size";
// const bird = {
//     size: "small",
// };
// console.log(bird[data]);     // small
// console.log(bird["size"]);   // small
// console.log(bird.size);      // small
// console.log(bird.data);      // undefined

// let c = { name: "Ravi"};
// let d;
// d=c;
// c.name = "Deepak";
// console.log(d.name); 
// output Deepak: because have same memory reference. or location.

// var x;
// var x=10;
// console.log(x);
// output:10 because it has global scope so we can declare it agian.

// var x;
// let x=10;
// console.log(x);
// Error: already declared because let has block scope. so it does not allowed to redeclare.

// let a = 3;              // number
// let b = new Number(3);  // object
// console.log(a==b);     //true
// console.log(a===b);    // false because === check type also so it is an object number.


// let name;
// var newName;
// console.log(name);
// console.log(newName);
// here both output undefined because we declared it. but not assigned a value.

// function fruit(){
//     console.log("Mongo");
//     fruit.name = "Apple";
// }
// fruit();
// output Mongo

// function sum(a,b){
//     return a+b;
// }
// console.log(sum(10,"20"));
// // output will be 1020 it will concat the like string.

// let num=0;
// console.log(num++);     // 0 because first we are printing number then incrementing value;
// console.log(++num);     // 2 because value is alreay 1 and we are incrementing value before printing so it's 2;
// console.log(num);       // 2 because we are just printing value.

// function getAge(...args){
//     console.log(typeof(args));
// }
// getAge(21);
// output: object because javascript arrays are the object.

// function getAge(){
//     'use strict';
//     age = 21;
//     console.log(age);
// }
// getAge();
// here age is not defined because Strict mode not allowed hoisting.

// const sum = eval("10*10+5");
// console.log(sum);
// output: 105 because eval function convert into number and then perform operation.

// How long session Storage is accessible
// it is accessible only while closing tab, or browser after that it is deleted.

// const obj = {1: "a", 2: "b", 3: "C"};
// console.log(obj.hasOwnProperty("1"));  // true: if property is a number then we can access it in both cases.
// console.log(obj.hasOwnProperty("1"));  // true

// const obj = {name: "a", a: "b", c: "C"};
// console.log(obj.hasOwnProperty("name"));  // true: 
// console.log(obj.hasOwnProperty(name)); // false: if property is a string then we can only access it using sting.

// // Program for swaping tow numbers:
// let a=50;
// let b=100;
// [a,b] = [b,a];
// console.log(a);
// console.log(b);

// const obj = {a:"one", b:"two", a:"again one"};
// console.log(obj);
// output: {a:"again one", b:"two"}; 

// for(let i=1; i<5; i++){
//     if (i==3) continue;
//     console.log(i);
// }
// output: 1,2,4 here 3 will be skiped.

// const foo = ()=>{ console.log("first") };
// const bar = ()=>{ setTimeout(()=>console.log("second")) };
// const baz = ()=>{ console.log("third") };

// bar();
// foo();
// baz();


// var vs let
// var has global scope
// var can be redeclared
// let has black scope

// es6+ 2015 features major update 
// const add = (a,b) => a+b; // arrow function
// console.log(add(10,20))
// Template Literals
// let name = "Ravi";
// console.log(`Hello, ${name}!`);


// // reverse string
// let name = "Ravi";
// let rName = "";
// for(let i=name.length - 1; i>=0; i--){
//     rName += name[i]
// }
// console.log(rName); 

// let name = "RAvi";
// let nString = name.split("").reverse().join();
// console.log(nString)

