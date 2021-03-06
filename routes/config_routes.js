const indexR = require("./index"); //import to index
const usersR = require("./users");//import to user
const carsR = require("./cars");//import to cakes



exports.routesInit = (app) => { //creat afunction using router on the app
  app.use("/",indexR);
  app.use("/users", usersR);
  app.use("/cars",carsR);

  // Checking the integrity of a router if it appears in public
  app.use((req,res) => {
    res.status(404).json({msg_error:"Url not found, 404!"});
  })
}


// Allows a server in a different domain to make requests to our server through a browser
exports.corsAccessControl = (app) => {
  app.all('*',  (req, res, next) => {
    if (!req.get('Origin')) return next();
   
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token,x-api-key');
    next();
  });
}