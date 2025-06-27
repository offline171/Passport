const {Router} = require("express");
const cartRouter = Router();
const pool = require("../db/pool");

cartRouter.get("/", async function(req,res){
    res.send(`GET HTTP methed on cart item resource`);
});

cartRouter.get("/:cartId", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cartId));
    res.send(`GET HTTP methed on cart item/${cartItem.name} resource`);
});

cartRouter.put("/:cartId", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cartId));
    res.send(`PUT HTTP methed on cart item/${cartItem.name} resource`);
});

cartRouter.post("/:cartId", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cartId));
    res.send(`POST HTTP methed on cart item/${cartItem.name} resource`);
});

cartRouter.delete("/:cartId", async function(req,res){
    const cartItem = (await fetchCartItem(req.params.cartId));
    res.send(`DELETE HTTP methed on cart item/${cartItem.name} resource`);
});

async function fetchCartItem(cartItemId){
  try{
    const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [cartItemId]);
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

module.exports = cartRouter;