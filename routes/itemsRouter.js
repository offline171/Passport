const {Router} = require("express");
const itemsRouter = Router();
const pool = require("../db/pool");

itemsRouter.get("/", async function(req,res){
    res.send(`GET HTTP methed on item resource`);
});

itemsRouter.get("/:itemsId", async function(req,res){
    const item = (await fetchItem(req.params.itemsId));
    res.send(`GET HTTP methed on item/${item.name} resource`);
});

itemsRouter.put("/:itemsId", async function(req,res){
    const item = (await fetchItem(req.params.itemsId));
    res.send(`PUT HTTP methed on item/${item.name} resource`);
});

itemsRouter.post("/:itemsId", async function(req,res){
    const item = (await fetchItem(req.params.itemsId));
    res.send(`POST HTTP methed on item/${item.name} resource`);
});

itemsRouter.delete("/:itemsId", async function(req,res){
    const item = (await fetchItem(req.params.itemsId));
    res.send(`DELETE HTTP methed on item/${item.name} resource`);
});

async function fetchItem(itemsId){
  try{
    const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [itemsId]);
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

module.exports = itemsRouter;