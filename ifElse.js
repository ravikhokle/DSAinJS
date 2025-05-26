let age = 21;
if (age>=18) {
    console.log("You can vote");
}else{
    console.log("You can not vote");
}


let unit = 220;
let amount=0;
if (unit>400) {
    amount += (unit-400) * 13;
    unit=400;
}
if (unit>200 && unit<=400) {
    amount += (unit-200) * 8;
    unit=200;
}
if (unit>100 && unit<=200) {
    amount += (unit-100) * 6;
    unit=100;
}
amount += unit*4;
console.log("Your Bill is:", amount);


// ternary operator
let num = -1;
console.log(num>0?"Positive Number":"Negative Number");
// Nested ternary operator
console.log(num>0?"Positive Number":num<0?"Negative Number":"Zero");
