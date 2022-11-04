sequelize model:create --name user --attributes 'first_name:string last_name:string username:string email:string phone_number:string zip_code:string'

sequelize model:create --name found_post --attributes 'species:string color:string breed:string gender:string name:string size:string age:string zip_code:string description:text pet_pic:string date_found:string user_fk:integer'

sequelize model:create --name lost_post --attributes 'species:string color:string breed:string gender:string name:string size:string age:string zip_code:string description:text pet_pic:string date_lost:string user_fk:integer'

sequelize model:create --name found_comment --attributes 'body:text found_fk:integer user_fk:integer'

# sequelize model:create --name lost_comment --attributes 'body:text lost_fk:integer user_fk:integer'
