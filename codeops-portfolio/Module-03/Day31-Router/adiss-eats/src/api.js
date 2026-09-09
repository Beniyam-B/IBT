export async function loadDishes(category,signal){
    const res = await fetch("../public/dishes.json",{signal});
    if(!res.ok) throw new Error("could not load menu");
    const all =await res.json();
    return category === "All" ? all :all.filter((d) =>d.category === category);
}