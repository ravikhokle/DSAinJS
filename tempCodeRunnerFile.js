let data = "size";
const bird = {
    size: "small",
};
console.log(bird[data]);     // small
console.log(bird["size"]);   // small
console.log(bird.size);      // small
console.log(bird.data);      // undefined