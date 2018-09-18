const { getClient, query, queryParams } = require("../db");
const md5 = require("md5");

module.exports = (server) => {
  server.get("/user", (request, response) => {
    getClient((errClient, client) => {
      if ( errClient ) {
        response.send(500, errClient);
      }

      query("SELECT * FROM users;", (err, res) => {
        client.end();     
        if (err) {
          response.send(500, err);
        }
        else {
          if(res.rows.length > 0) {
            res = res.rows;
          }
          response.send(200, res);
        }
      }, client);
    });
    
  });

  server.get("/user/:codeUser", (request, response) => {
    const codeUser = parseInt(request.params.codeUser);

    getClient((errClient, client) => {
      if ( errClient ) {
        response.send(500, errClient);
      }

      queryParams("SELECT * FROM users WHERE code_user = $1", [codeUser], (err, res) => {
        client.end();        
        if (err) {
          response.send(500, err);
        }
        else {
          let users = [];
          if(res.rows.length > 0) {
            users = res.rows;
          }
          response.send(200, users);
        }

      }, client);     
    });
  });

  server.post("/user/login", (request, response) => {
    if(request.body) {
      const user = {
        email: request.body.email,
        password: md5(request.body.password)
      };

      getClient((errClient, client) => {
        if ( errClient ) {
          response.send(500, errClient);
        }
  
        queryParams("SELECT * FROM users WHERE email = $1 AND password = $2", [user.email, user.password], (err, res) => {
          client.end();
          if (err) {
            response.send(500, err);
          }
          else {
            let logged = false;
            if(res.rows.length > 0) {
              logged = true;
            }
            response.send(200, {success: logged});
          }
  
          client.end();
        }, client);     
      });
    }
  });

  // server.post("/user/new", () => {

  // });

  // server.post("/user/edit", () => {

  // });

};