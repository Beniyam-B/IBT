export async function getDishes() {
  return [
    { id: "kitfo", name: "Kitfo", description: "Minced raw beef seasoned with mitmita and niter kibbeh.", price: 350 },
    { id: "shiro", name: "Shiro", description: "Spiced chickpea stew served with injera.", price: 220 },
    { id: "doro-wat", name: "Doro Wat", description: "Spicy chicken stew with berbere and boiled egg.", price: 400 },
    { id: "tibs", name: "Tibs", description: "Sauteed beef or lamb with onions and peppers.", price: 380 },
  ];
}

export async function getDish(id) {
  const dishes = await getDishes();
  return dishes.find((d) => d.id === id) || null;
}