require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const {storage} = require('./cloudinary');
const multer = require('multer');

const upload = multer({storage})



var morgan = require('morgan');

// app.use(morgan('combined'))

const sessionConfig = {
    store: new (require('connect-pg-simple')(session))(),
    secret: 'ChloeAndMiloAreBestFriends',
    resave: true,
    saveUninitialized: true,
    name: 'token',
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false
    }
    
}

// const existingSesssion = async (req, res, next) => {
//     if(req.cookies.token){
//         const sid = req.cookies.token.slice(2, 34)
//         console.log(sid)
//         try{
//             const existingSession = await db.query("SELECT sess -> 'passport' -> 'user' FROM session WHERE sid = $1;", [sid]);
//             console.log(existingSession.rows[0]['?column?'])
//         } catch(err){

//         }
//     }
// next();
// }



//middleware

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session(sessionConfig));
app.use(cookieParser("ChloeAndMiloAreBestFriends"))
app.use(express.json())


app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in to do that');
        return res.redirect('/api/v1/')
    }
    next();
}


const db = require("./db");
const saltRounds = 10;

passport.use(
    new LocalStrategy({passReqToCallback: true}, async function (req, username, password, done) {
    if(!username || !password ) { 
        return done(null, false); 
    } 
    try{
        const response = await db.query('SELECT * FROM users WHERE username = $1;', [username]);
        if (!response) {
            return done(null, false, {message: 'Try again'});
        } else {
            var hashed = response.rows[0].user_pass;
            bcrypt.compare(password, hashed, function(err, res) {
                if (err){
                    throw err;
                } else if(res === true){
                    return done(null, response.rows[0])
                } else {
                    return done(null, false);
                }
                
            });
        };
    }
    catch (err){
        return done(err)
    }
}));

passport.serializeUser((req, user, done) => {
    done(null, user.username); 
});

passport.deserializeUser( async (username, done) => {
    try{
        let userData = await db.query('SELECT * FROM users WHERE username = $1;', [username]);

        if (!userData){
            return done(new Error("User not found"));
        }
        done(null, {'id': userData.rows[0].id, 'first_name': userData.rows[0].first_name, 'username': userData.rows[0].username, 'email': userData.rows[0].email});
    } 
    catch (err){
        done(err)
    }
})

//User Routes

//============================Register User
app.post('/api/v1/register', async (req, res, next) => {
	let firstname = req.body.first_name;
	let username = req.body.username;
    let email = req.body.email

    try{
        const existingUsername = await db.query("SELECT username FROM users WHERE username = $1", [username]);
        if(existingUsername.rows[0]){
            return res.status(200).json({message: "Username or email is already in use", error: true})
        }
        const existingEmail = await db.query("SELECT email FROM users WHERE email = $1", [email]);
        if(existingEmail.rows[0]){
            return res.status(200).json({message: "Username or email is already in use", error: true})
        }
        bcrypt.genSalt(saltRounds, (err, salt) => {	
            if (err) return next(err);
            bcrypt.hash(req.body.user_pass, salt, async function(err, hash) {
                if (err) return next(err);
               
                let q = "INSERT INTO users (first_name, username, user_pass, email) VALUES ($1, $2, $3, $4) RETURNING username";	
                const response = await db.query(q, [firstname, username, hash, email]) 
                    if(response.rows[0]){
                        return res.status(200).json({message: "Account created! Redirecting..", error: false})
                    }
                    console.log(response)
                });
            });
    } catch(err) {
        console.log('this anything')
    }
});

app.post('/api/v1/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/api/v1/',
        failureRedirect: '/api/v1/login'
    })
    (req, res, next);
});


app.get('/api/v1/logout', function(req, res){
    req.logout();
    console.log("logout called")
    res.redirect('/api/v1');
  });

//============================Data Routes

app.get("/api/v1", async (req, res) =>{
    try{
        if (req.user){
            const tags = await db.query("SELECT id, tag_name FROM tags;");
            const biomes = await db.query("SELECT id, biome_name FROM biomes;");
            const dangers = await db.query("SELECT id, danger_name FROM dangers;");
            const allLocations = await db.query("SELECT * FROM locations ORDER BY created_at DESC LIMIT 5;");
            const allWorlds = await db.query("SELECT id, world_name, owner_username, seed, bosses_defeated, map_id, header_id FROM worlds;");

            // My Data
            const myWorldFollows = await db.query("SELECT id, world_name, owner_username, seed, bosses_defeated, map_id, header_id FROM worlds LEFT JOIN worlds_follows ON worlds_follows.world_id = worlds.id WHERE follower_id = $1;", [req.user.id]);

            const myFollows = await db.query("SELECT id, username, first_name FROM users LEFT JOIN follows ON follows.followee_id = users.id WHERE follower_id = $1;", [req.user.id]);

            const myFollowers = await db.query("SELECT id, username, first_name FROM users LEFT JOIN follows ON follows.follower_id = users.id WHERE followee_id = $1;", [req.user.id]);

            const myLocations = await db.query("SELECT id, location_name, world_id, builder_username FROM locations WHERE builder_username = $1;", [req.user.username]);
            const myWorlds = await db.query("SELECT id, world_name, seed, owner_username AS world_owner, bosses_defeated FROM worlds LEFT JOIN worlds_users ON worlds_users.world_id = worlds.id WHERE worlds_users.username = $1;", [req.user.username]);
            
            res.status(200).json({
                status: "success",
                data: {
                    tags: tags.rows,
                    biomes: biomes.rows,
                    dangers: dangers.rows,
                    allLocations: allLocations.rows,
                    allWorlds: allWorlds.rows,
                    myWorldFollows: myWorldFollows.rows,
                    myFollows: myFollows.rows,
                    myFollowers: myFollowers.rows,
                    myLocations: myLocations.rows,
                    myWorlds: myWorlds.rows,
                    userData: req.user,
                }
            });
        } else {
                    // Generic Data
            const tags = await db.query("SELECT id, tag_name FROM tags;");
            const biomes = await db.query("SELECT id, biome_name FROM biomes;");
            const dangers = await db.query("SELECT id, danger_name FROM dangers;");
            const allLocations = await db.query("SELECT id, location_name, world_id, builder_username FROM locations ORDER BY created_at DESC LIMIT 5;");
            const allWorlds = await db.query("SELECT id, world_name, owner_username, seed, bosses_defeated, map_id, header_id, FROM worlds;");

            res.status(200).json({
                status: "success",
                data: {
                    tags,
                    biomes,
                    dangers,
                    allLocations,
                    allWorlds
                }
            });
        }



    } catch (err){
        console.log(err);
    } 
})

// Location detail page
app.get("/api/v1/locations/:location_id", isLoggedIn, async (req, res) =>{
    try{
        const selectedLocation = await db.query("select locations.id, locations.location_name, locations.location_description, locations.builder_username, biomes.biome_name, worlds.world_name, tags.tag_name, dangers.danger_name from locations left join locations_biomes on locations_biomes.location_id = locations.id left join biomes on biomes.id = locations_biomes.biome_id left join locations_dangers on locations_dangers.location_id = locations.id left join dangers on dangers.id = locations_dangers.danger_id left join locations_tags on locations_tags.location_id = locations.id left join tags on tags.id = locations_tags.tag_id left join worlds on worlds.id = locations.world_id where locations.id = $1", [req.params.location_id]);
        res.status(200).json({
            status: "success",
            data: {
                selectedLocation: selectedLocation.rows
            }
        });
    } catch (err){
        console.log(err);
    }
})




// Get all worlds and data for a user
app.get("/api/v1/worlds/:world_id", isLoggedIn, async (req, res) =>{
    try{
        const world_data = await db.query("SELECT id, world_name, seed, owner_username AS world_owner, bosses_defeated FROM worlds LEFT JOIN worlds_users ON worlds_users.world_id = worlds.id WHERE worlds_users.username = $1;", [req.user.username]);
        const location_data = await db.query("SELECT id, location_name, world_id, builder_username FROM locations WHERE world_id = $1;", [req.params.world_id])
        const resident_data = await db.query("SELECT first_name, users.username FROM users RIGHT JOIN worlds_users ON worlds_users.username = users.username WHERE worlds_users.world_id = $1;", [req.params.world_id])
        const my_locations = await db.query("SELECT id, location_name, world_id, builder_username FROM locations WHERE builder_username = $1;", [req.user.username])
        res.status(200).json({
            status: "success",
            data: {
                world_data: world_data.rows,
                location_data: location_data.rows,
                resident_data: resident_data.rows,
                my_locations: my_locations.rows,
            }
        });
    } catch (err){
        console.log(err);
    } 
})


//Add a world
app.post("/api/v1/worlds", isLoggedIn, async (req, res) =>{
    try{
        const newWorld = await db.query("WITH insert1 AS(INSERT INTO worlds (world_name, owner_username, seed, bosses_defeated) VALUES ($1, $2, $3, $4) RETURNING id as world_id, owner_username AS username) INSERT INTO worlds_users (world_id, username) SELECT world_id, username FROM insert1;", [req.body.world_name, req.body.owner_username, req.body.seed, req.body.bosses_defeated]);
        res.status(200).json({
            status: "success",
            data: {
                world_id: newWorld.rows[0]
            }
        });
    } catch (err){
        console.log(err);
    }
})

//Update a World
app.put("/api/v1/worlds/:id", isLoggedIn, async (req, res) =>{
    try{
        const results = await db.query("UPDATE worlds SET world_name = $1, seed = $2, bosses_defeated = $3 WHERE id = $4 returning *", [req.body.world_name, req.body.seed, req.body.bosses_defeated, req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                location: results.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//Delete a World
app.delete("/api/v1/worlds/:id", isLoggedIn, async (req, res) =>{
    try{
        const results = db.query("DELETE FROM worlds WHERE id = $1", [req.params.id])
        res.status(204).json({
            status: "success"
        });
    } catch (err){
        console.log(err)
    }
})

//Add a location
app.post("/api/v1/locations", isLoggedIn, upload.array('locationImage'), async (req, res) =>{
    try{
        const newLocation = await db.query("INSERT INTO locations (location_name, location_description, biome, builder_username, world_id, added_by) VALUES ($1, $2, $3, $4, $5, $6) returning *", [req.body.location_name, req.body.location_description, req.body.biome, req.body.builder_username, req.params.world_id, req.body.added_by]);
        res.status(200).json({
            status: "success",
            data: {
                location_id: newLocation.rows[0]
            }
        });
    } catch (err){
        console.log(err);
    }
})

//Update a location
app.put("/api/v1/locations/:location_id/update", isLoggedIn, async (req, res) =>{
    try{
        const results = await db.query("UPDATE locations SET location_name = $1, location_description = $2, biome  = $3, builder_username = $4, WHERE id = $5 returning *", [req.body.location_name, req.body.location_description, req.body.biome, req.body.builder_username, req.params.location_id]);
        res.status(200).json({
            status: "success",
            data: {
                location: results.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//Delete a location
app.delete("/api/v1/locations/:location_id", isLoggedIn, async (req, res) =>{
    try{
        const results = db.query("DELETE FROM locations WHERE id = $1", [req.params.location_id])
        res.status(204).json({
            status: "success"
        });
    } catch (err){
        console.log(err)
    }
})

// search
app.get("/api/v1/search/:searchTerm", async (req, res) =>{
    try{
        const searchResults = await db.query("select lid, location_name, location_description, location_dangers, location_tags, location_biomes, location_header_url from (select locations.id as lid, locations.location_name as location_name, locations.location_description as location_description, locations.header_url as location_header_url, string_agg(biomes.biome_name, ' ') as location_biomes, string_agg(dangers.danger_name, '') as location_dangers, string_agg(tags.tag_name, ' ') as location_tags, to_tsvector(locations.location_name) || to_tsvector(locations.location_description) || to_tsvector(coalesce((string_agg(biomes.biome_name, '')), '')) || to_tsvector(coalesce((string_agg(dangers.danger_name, '')), '')) || to_tsvector(coalesce((string_agg(tags.tag_name, ' ')), '')) as document from locations left join locations_biomes on locations_biomes.location_id = locations.id left join biomes on biomes.id = locations_biomes.biome_id left join locations_dangers on locations_dangers.location_id = locations.id left join dangers on dangers.id = locations_dangers.danger_id left join locations_tags on locations_tags.location_id = locations.id left join tags on tags.id = locations_tags.tag_id group by locations.id, locations.location_name, locations.location_description, locations.header_url) location_search where location_search.document @@ to_tsquery('english', $1)", [req.params.searchTerm]);
        // biomes, tags, dangers, builder, location name, world name
        
        res.status(200).json({
            status: "success",
            data: {
                searchResults: searchResults.rows
            }
        });
    } catch (err){
        console.log(err);
    }
})

const port = process.env.PORT || 3001;

app.listen(port, ()=> {
    console.log(`server is up and listening on port ${port}`);
});
