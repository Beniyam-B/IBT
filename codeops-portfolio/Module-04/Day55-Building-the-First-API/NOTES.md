# Day 55 notes

## Exercise 6: two different empty answers
GET /api/v1/restaurants/9999/menu is a 404 because the restaurant itself does not exist, while GET /api/v1/restaurants/1/menu?category=Dessert is a 200 with [] because the restaurant exists and simply has nothing in that category.
