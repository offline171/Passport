const {Router} = require("express");
const cartRouter = Router();
const pool = require("../db/pool");

cartRouter.get("/", async function(req,res){
  const cartItems = (await fetchUserCartItems(req.user.user_id));
  res.render("cart", { user: req.user, cartItems: cartItems});
});

cartRouter.get("/user", async function(req,res){
    console.log('What is going on?');
    res.send(`GET user info methed on user resource`);
});

cartRouter.get("/user/:userId", async function(req,res){
  const cartItems = (await fetchUserCartItems(req.params.userId));
  res.render("cart", { user: req.params.userId, cartItems: cartItems});  
});

cartRouter.get("/:cart_id", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cart_Id));
    const item = (await fetchItem(cartItem.itemid));
    res.send(`GET HTTP methed on cart item/${item.name} resource`); 
});

cartRouter.put("/:cart_id", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cart_Id));
    const item = (await fetchItem(cartItem.itemid));
    res.send(`PUT HTTP methed on cart item/${item.name} resource`);
});

cartRouter.post("/:userId/:itemId", async function(req,res,next){
  try {
    await pool.query("insert into cartitems (userId, itemId) values ($1, $2)", [req.params.userId, req.params.itemId]);
    res.redirect("/cart");
  } catch(error) {
    console.error(error);
    next(error);
  }
});

cartRouter.delete("/:cart_id", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cart_id));
    const item = (await fetchItem(cartItem.itemid));
    res.send(`DELETE HTTP methed on cart item/${item.name} resource`);
});

async function fetchCartItem(cartItemId){
  try{
    const { rows } = await pool.query("SELECT * FROM cartitems WHERE cart_id = $1", [cartItemId]);
    const item = rows[0];
    if(item) {
      console.log('Cart item found');
      return item;
    } else {
      console.log('Cart item not found');
    }
  } catch(error) {
    console.error('Error, cannot find items.');
  }
}

//get this from export and require later
async function fetchUserCartItems(userId){
  try{
    const { rows } = await pool.query("SELECT * FROM cartitems WHERE userId = $1", [userId]);
    const items = rows;
    if(items) {
      return items;
    } else {
      console.log('Item not found');
    }
  } catch(error) {
    console.error('Error, cannot find items.');
  }
}

//also this one
async function fetchItem(itemId){
  console.log(`Item Id found to be /${itemId}`);
  try{
    const { rows } = await pool.query("SELECT * FROM items WHERE item_id = $1", [itemId]);
    const items = rows[0];
    if(items) {
      return items;
    } else {
      console.log('Item not found');
    }
  } catch(error) {
    console.error('Error, cannot find items.');
  }
}

async function fetchItems(items){
  const cart = [];
  for(i = 0; i < items.length; i++){
    cart[i] = fetchItem(items[i].itemId);
  }
  return cart;
}
module.exports = cartRouter;