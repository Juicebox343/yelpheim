sudo service postgresql start
sudo -u postgres psql


DROP DATABASE yelpheim;
CREATE DATABASE yelpheim;

CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_pass VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE worlds (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    world_name VARCHAR(50) NOT NULL,
    owner_username VARCHAR(50) NOT NULL REFERENCES users(username),
    seed VARCHAR(50) NOT NULL,
    bosses_defeated INT NOT NULL check (bosses_defeated >= 0 and bosses_defeated <=5),
    residents VARCHAR(25) 
);

CREATE TABLE worlds_users (
    world_id BIGINT NOT NULL REFERENCES worlds(id),
    username VARCHAR(50) NOT NULL REFERENCES users(username)
);

CREATE TABLE locations (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    location_name VARCHAR(50) NOT NULL,
    location_description VARCHAR(500) NOT NULL,
    biome VARCHAR(25) NOT NULL,
    builder_username VARCHAR(50) REFERENCES users(username),
    added_by VARCHAR(50) NOT NULL REFERENCES users(username),
    world_id BIGINT NOT NULL REFERENCES worlds(id) 
);

CREATE TABLE tags (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL
);

CREATE TABLE locations_tags (
    tag_id BIGINT NOT NULL REFERENCES tags(id),
    location_id BIGINT NOT NULL REFERENCES locations(id)
);


INSERT INTO users (first_name, username, user_pass, email) VALUES ('Joe', 'Juicebox343', '100852', 'number1target@gmail.com');
INSERT INTO worlds (world_name, owner_id, seed, bosses_defeated) VALUES ('Palheim', 1, 'AZfqhmCT6j', 3);

INSERT INTO worlds_users (world_id, user_id) VALUES (1,1);

INSERT INTO locations (location_name, location_description, owner_id, world_id) VALUES ('Palheim', 'Historic Palheim. Centrally located, the first settlement in this generation of the 10th realm.', 1, 1);
INSERT INTO locations (location_name, location_description, owner_id, world_id) VALUES ('East Paleim', 'Perched along a mountain cliff face, East Palheim boasts easy access to Plains, Swamps, and Mountain biomes.', 1, 1);


SELECT id AS world_id, world_name, seed, owner_id AS world_owner, bosses_defeated FROM worlds WHERE owner_id = 1;

SELECT worlds_users.user_id, users.first_name FROM worlds_users RIGHT JOIN users ON worlds_users.user_id = users.id WHERE world_id = 1;

insert into tags (tag_name) values ('Forge (Level 1)'), ('Forge (Level 2)'), ('Forge (Level 3)'), ('Forge (Level 4)'), ('Forge (Level 5)'), ('Forge (Level 6)'), ( 'Forge (Level 7)'), ('Workbench (Level 1)'), ('Workbench (Level 2)'), ('Workbench (Level 3)'), ('Workbench (Level 4)'), ('Workbench (Level 5)'), ('Smelter'), ('Blast Furnace'), ('Open Beds'), ('Open Storage'), ('5+ Comfort'), ('10+ Comfort'), ('15+ Comfort'), ('Not Fortified'), ('Fortified'), ('Impenetrable'), ('Portal'),( 'Resource Farm'), ('Harbor');

INSERT INTO worlds (world_name, owner_username, seed, bosses_defeated) VALUES ($1, $2, $3, $4) returning *

WITH insert1 AS(
    INSERT INTO worlds (world_name, owner_username, seed, bosses_defeated)
    VALUES ($1, $2, $3, $4)
    RETURNING id as world_id)
)
INSERT INTO worlds_users (world_id, username)
VALUES (world_id, $6)


-- is authenticated?
-- yes? load world gallery - with own world as priority
-- no? load world gallery

-- Front Page
-- load all world data on navigation
-- load locations with world_id

-- Location Page
-- Load all world data on navigation
-- load all location data 

WITH insert1 AS (INSERT INTO worlds (world_name, owner_username, seed, bosses_defeated) VALUES ($1, $2, $3, $4) RETURNING id as world_id)), insert2 AS(INSERT INTO worlds_users (world_id, username) VALUES (world_id, $6));


WITH insert1 AS(INSERT INTO worlds (world_name, owner_username, seed, bosses_defeated) VALUES ($1, $2, $3, $4) RETURNING id as world_id)) INSERT INTO worlds_users (world_id, username) VALUES (world_id, $6)


WITH insert1 AS(INSERT INTO worlds (world_name, owner_username, seed, bosses_defeated) VALUES ($1, $2, $3, $4) RETURNING id as world_id, owner_username AS username) 
INSERT INTO worlds_users (world_id, username) SELECT world_id, username FROM insert1;


SELECT id, username FROM worlds LEFT JOIN worlds_users ON worlds_users.world_id = worlds.id WHERE worlds_users.world_id = 6;


WITH select1 AS(SELECT id, username FROM worlds LEFT JOIN worlds_users ON worlds_users.world_id = worlds.id WHERE worlds_users.username = 'Juicebox343')
SELECT worlds_users.username, users.first_name FROM worlds_users, select1 RIGHT JOIN users ON worlds_users.username = users.username WHERE worlds_users.world_id = select1.world_id;



WITH select1 AS(SELECT id, username FROM worlds LEFT JOIN worlds_users ON worlds_users.world_id = worlds.id WHERE worlds_users.world_id = 6);


WITH select1 AS(SELECT id, username FROM worlds LEFT JOIN worlds_users ON worlds_users.world_id = worlds.id WHERE worlds_users.username = 'Juicebox343') SELECT 

 first_name, users.username FROM users RIGHT JOIN worlds_users ON worlds_users.username = users.username WHERE worlds_users.world_id = 6;

select sess -> 'passport' -> 'user' from session where CAST (sess -> 'passport' ->> 'user' AS VARCHAR) = 'Juicebox343';

await db.query("SELECT sess -> 'passport' -> 'user' FROM session WHERE CAST (sess -> 'passport' ->> 'user' AS VARCHAR) = $1;", [req.user.username]);











-- 


	select
	locations.location_name || ' ' || 
coalesce((string_agg(biomes.biome_name , ' ')), '') 
as document
from
	locations
join locations_biomes on
	locations_biomes.location_id = locations.id
join biomes on
	biomes.id = locations_biomes.biome_id
group by
	locations.location_name
	


select
	to_tsvector(locations.location_name) ||
	to_tsvector(locations.location_description) ||
	to_tsvector(coalesce(locations.builder_username, '')) ||
	to_tsvector(worlds.world_name) ||
	to_tsvector(coalesce((string_agg(biomes.biome_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(dangers.danger_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(tags.tag_name, ' ')), ''))
	as document
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on 
	worlds.id = locations.world_id
group by
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name
	

UPDATE locations SET searchtext = 
	to_tsvector(locations.location_name) ||
	to_tsvector(locations.location_description) ||
	to_tsvector(coalesce(locations.builder_username, '')) ||
	to_tsvector(worlds.world_name) ||
	to_tsvector(coalesce((string_agg(biomes.biome_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(dangers.danger_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(tags.tag_name, ' ')), ''))
	as document
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on 
	worlds.id = locations.world_id
group by
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name
	

	
	
	
	with cte_search as (
select 
	to_tsvector(locations.location_name) ||
	to_tsvector(locations.location_description) ||
	to_tsvector(coalesce(locations.builder_username, '')) ||
	to_tsvector(worlds.world_name) ||
	to_tsvector(coalesce((string_agg(biomes.biome_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(dangers.danger_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(tags.tag_name, ' ')), ''))
	as document
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on 
	worlds.id = locations.world_id
group by
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name
)
update
	locations
set
	searchtext = cte_search.document
from
	cte_search




    with my_cte as (select
	locations.location_name || ' ' ||
	locations.location_description || ' ' ||
	coalesce(locations.builder_username, '') || ' ' ||
	worlds.world_name || ' ' ||
	coalesce((string_agg(biomes.biome_name, '')), '') || ' ' ||
	coalesce((string_agg(dangers.danger_name, '')), '') || ' ' ||
	coalesce((string_agg(tags.tag_name, ' ')), '')
	as document
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on 
	worlds.id = locations.world_id
group by
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name) 
	update locations set searchtext = to_tsvector('english', my_cte.document) from my_cte
	

	
	
with my_cte as (select
    locations.id,
	locations.location_name,
	locations.location_description,
	coalesce((string_agg(biomes.biome_name, '')), ' ')  as biome_name,
	coalesce((string_agg(dangers.danger_name, '')), ' ')  as danger_name,
	coalesce((string_agg(tags.tag_name, ' ')), ' ')  as tag_name
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
group by
	locations.id,
	locations.location_name,
	locations.location_description) 
update locations set searchtext = to_tsvector('english', my_cte.location_name || ' ' || my_cte.location_description || ' ' || my_cte.biome_name || ' ' || my_cte.danger_name || ' ' || my_cte.tag_name) from my_cte where my_cte.id = locations.id
	

	

    create trigger ts_searchtext before
insert
    or
update
    on
    public.locations for each row execute function tsvector_update_trigger('searchtext', 'pg_catalog.english', 'location_name', 'location_description')

select lid, l_name, l_desc, l_dangers, l_tags, l_biomes from
(select 
	locations.id as lid,
	locations.location_name as l_name,
	locations.location_description as l_desc,
	string_agg(biomes.biome_name, '') as l_biomes,
	string_agg(dangers.danger_name, '') as l_dangers,
	string_agg(tags.tag_name, ' ') as l_tags,
	to_tsvector(locations.location_name) ||
	to_tsvector(locations.location_description) ||
	to_tsvector(coalesce(locations.builder_username, '')) ||
	to_tsvector(worlds.world_name) ||
	to_tsvector(coalesce((string_agg(biomes.biome_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(dangers.danger_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(tags.tag_name, ' ')), ''))
	as document
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on 
	worlds.id = locations.world_id
group by
locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name
) l_search
where l_search.document @@ to_tsquery('swamp & mountain'); 

select lid, l_name, l_desc, l_dangers, l_tags, l_biomes from
(select 
	locations.id as lid,
	locations.location_name as l_name,
	locations.location_description as l_desc,
	string_agg(biomes.biome_name, '') as l_biomes,
	string_agg(dangers.danger_name, '') as l_dangers,
	string_agg(tags.tag_name, ' ') as l_tags,
	to_tsvector(locations.location_name) ||
	to_tsvector(locations.location_description) ||
	to_tsvector(coalesce(locations.builder_username, '')) ||
	to_tsvector(worlds.world_name) ||
	to_tsvector(coalesce((string_agg(biomes.biome_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(dangers.danger_name, '')), '')) ||
	to_tsvector(coalesce((string_agg(tags.tag_name, ' ')), ''))
	as document
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on 
	worlds.id = locations.world_id
group by
locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name
) l_search
where l_search.document @@ to_tsquery('swamp & mountain'); 


select
	locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name,
	string_agg(distinct biomes.biome_name, ' '),
	string_agg(distinct tags.tag_name, ' '),
	string_agg(distinct dangers.danger_name, ' ')
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on
	worlds.id = locations.world_id
where
	locations.id = 23
group by	
	locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	worlds.world_name


-- THIS ONE JOE
select
	locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	locations.header_url,
	worlds.world_name,
	array_agg(distinct biomes.biome_name) biomes,
	array_agg(distinct tags.tag_name) tags,
	array_agg(distinct dangers.danger_name) dangers
from
	locations
left join locations_biomes on
	locations_biomes.location_id = locations.id
left join biomes on
	biomes.id = locations_biomes.biome_id
left join locations_dangers on
	locations_dangers.location_id = locations.id
left join dangers on
	dangers.id = locations_dangers.danger_id
left join locations_tags on
	locations_tags.location_id = locations.id
left join tags on
	tags.id = locations_tags.tag_id
left join worlds on
	worlds.id = locations.world_id
where
	locations.id = 23
group by	
	locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	locations.header_url,
	worlds.world_name



select
	locations.id,
	locations.location_name,
	locations.location_description,
	locations.builder_username,
	locations.added_by,
	locations.world_id,
	images.id as image_id,
	images.url as image_url,
	images.image_name as image_name
from
	locations
left join images on
	images.entity_id = locations.id
	and images.is_main = true
order by
	locations.created_at desc
limit 5