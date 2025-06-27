const {Router} = require("express");
const indexRouter = Router();
const pool = require("../db/pool");


indexRouter.get("/", async function(req, res) {
  const items = await fetchItems();
  res.render("index", { user: req.user, items: items});
});

// get items for index
async function fetchItems(){
  try{
    const { rows } = await pool.query("SELECT * FROM items");
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

module.exports = indexRouter;