const express = require('express');
const axios = require('axios');
const app = express();
const path = require("path");
var bodyParser = require('body-parser');
const { Script } = require('vm');
const { error } = require('console');
const { consumers } = require('stream');
const { render } = require('ejs');




//const base_url = "http://localhost:3000";
const base_url = "http://node60365-projects.proen.app.ruk-com.cloud";

var username
var id_user
var post_id

app.set("views", path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(__dirname + '/public'));


function post(){

app.get("/Create_Post", async(req,res) => {
    try {
        const respones = await axios.get(`${base_url}/users`) 
         
         respones.data.map(x=>{
            if(username == x.username) id_user = x.user_id
        })
        res.render('CreatePost',{nameuser : username})
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Create post Error')
    }
    
})



app.get("/post/:post_id", async(req,res) => {
    try {
        const data = {
            user_id : req.body.user_id
        }
        console.log(username) 
        post_id = req.params.post_id
      
        console.log(id_user) 
         const respones_user = await axios.get(`${base_url}/users`) 
         const respones_post = await axios.get(`${base_url}/posts`) 
         const respones_comment = await axios.get(`${base_url}/comments`) 
        res.render('PersonalPost' , {
            nameuser : username , 
            user : respones_user.data,
             post: respones_post.data ,
              post_id : req.params.post_id , 
             comment : respones_comment.data
            })

    } catch(err) {
        console.error(err);
        res.status(500).send('Error');
    }
})

}

function Login(){
    app.get("/", async(req, res) => {
        res.render("Login");
    });
    
    
    app.post("/user_Post", async(req, res) => {
        try {
    
            const user = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                //role: req.body.role,
            }
        
            if (req.body.username == "" || req.body.password  == "" || req.body.email == "") {
                const alert = "<script>window.location='/' ; alert('Please fullfill your username , password or email')</script>";
                res.send(alert);
            }

            else {
                if (req.body.username =="admin" || req.body.password =="admin") {
                    username = req.body.username
                    await axios.post(`${base_url}/user_Post`, user)
                    const respones_post = await axios.get(base_url+'/posts')
                    const respones_user = await axios.get(base_url+'/users')
                    res.render('HomePageAdmin',{nameuser: req.body.username, user: respones_user.data , post: respones_post.data })
                }
                else {
                    await axios.post(`${base_url}/user_Post`, user)
                    username = req.body.username
                    const respones_post = await axios.get(base_url+'/posts')
                    const respones_user = await axios.get(base_url+'/users')
                    res.render('HomePage',{nameuser: req.body.username, user: respones_user.data , post: respones_post.data })
        
                }
            }
        } catch(err) {
            console.error(err);
            res.status(500).send('Error');
        }
    
        
    });
    
    app.post("/Check_user", async(req, res) => {
        try {
            const data_user = {
                username: req.body.username,
                password: req.body.password,
            }
            const respones = await axios.get(`${base_url}/users`)
        
            let user
            let password
            for (let i = 0; i < respones.data.length; i++) {
                user = check_user(respones.data[i].username, data_user.username)
                password = check_password(respones.data[i].password, data_user.password)
                if (user == true && password == true) break
            }
            // Login
            
            if (user == true && password == true) {
                if (req.body.username == "admin" || req.body.password == "admin" ) {
                    username = req.body.username
                    const respones_post = await axios.get(base_url+'/posts')
                    const respones_user = await axios.get(base_url+'/users')
                    respones.data.map((x,id)=>{
                        if(x.username == username) id_user = id+1
                    })
                    res.render('HomePageAdmin', {nameuser: req.body.username,user: respones_user.data, post:respones_post.data})
                }
                else {
                    username = req.body.username
                    const respones_post = await axios.get(base_url+'/posts')
                    const respones_user = await axios.get(base_url+'/users')
                    respones_user.data.map((x,id)=>{
                        if(x.username == username) id_user = respones_user.data[id].user_id
                    })
                  
                    res.render('HomePage',{nameuser: req.body.username,user: respones_user.data, post:respones_post.data })
                }
            }
            else {
                const alert =
                        "<script>window.location='/' ; alert('Login failed username or password.')</script>";
                res.send(alert);
            }
        } catch(err) {
            console.error(err);
            res.status(500).send('Check User error')
        }
    });
    
    app.get("/Home_user", async(req,res) => {
        const respones_user = await axios.get(`${base_url}/users`) 
        const respones_post = await axios.get(`${base_url}/posts`) 
        try {
            if (username == "admin") {       
                console.log("this is admin homepage")
                res.render('HomePageAdmin',{ nameuser : username , user : respones_user.data , post: respones_post.data})
            } else {
                res.render('HomePage',{ nameuser : username , user : respones_user.data , post: respones_post.data})
            }
            
        } catch(err) {
            console.error(err);
            res.status(500).send('error Home_user');
        }
    })
    
    app.post("/Home_user", async(req,res) => {
        try {
            const data = {
                user_id : req.body.user_id,
                title : req.body.title,
                content: req.body.content
            }
    
            data.user_id = id_user
            
           
             await axios.post(`${base_url}/post_Post`,data) 
             const respones_user = await axios.get(`${base_url}/users`) 
             const respones_post = await axios.get(`${base_url}/posts`) 
          
            res.render('HomePage',{ nameuser : username , user : respones_user.data , post: respones_post.data})
        } catch(err) {
            console.error(err);
            res.status(500).send('Home user error')
        }
    })
    app.get("/alert_login", async(req, res) => {
        try {
            const alert = "<script> window.location='/' ; alert('Please login or register before create post.')</script>"
            res.send(alert);
        } catch(err) {
            console.error(err);
            res.status(500).send('alert login error')
        }
    
    });
}

function check_user(data, user) {
    if (data == user) return true
    else return false
}

function check_password(data, password) {
    if (data == password) return true
    else return false
}


app.post('/Comment_Post' ,async(req, res) => {
    try {

        const data = { 
            comment : req.body.comment,
            post_id : req.body.post_id,
            user_id : req.body.user_id
        }
        console.log(id_user)
        data.user_id = id_user
        data.post_id = post_id
         await axios.post(base_url + '/comment_Post',data)
        const respones_user = await axios.get(`${base_url}/users`) 
        const respones_post = await axios.get(`${base_url}/posts`) 
        res.redirect('/PersonalPost')
       
    } catch(err) {
        console.error(err);
        res.status(500).send('Comment_post Error') 
    }
});
app.get('/PersonalPost' ,async(req, res) => {
    try {
        
        const respones_user = await axios.get(`${base_url}/users`) 
        const respones_post = await axios.get(`${base_url}/posts`) 
        const respones_comment = await axios.get(`${base_url}/comments`) 
        res.render('PersonalPost' , {nameuser : username , user : respones_user.data , post: respones_post.data , post_id : post_id , comment : respones_comment.data})
       
    } catch(err) {
        console.error(err);
        res.status(500).send('Comment_post Error') 
    }
});

app.get('/Comment_Post/:post_id' ,async(req, res) => {
    try {
        const data_comment = { 
            comment : req.body.comment,
            post_id : req.body.post_id,
            user_id : req.body.user_id
        }
        
        await axios.post(`${base_url}/comment_Post`,data_comment)
        const respones_user = await axios.get(`${base_url}/users`) 
        const respones_post = await axios.get(`${base_url}/posts`) 
        res.render('Login')
        //res.render('PersonalPost' , {nameuser : username , comment : req.body.comment , user : respones_user , post : respones_post , post_id: req.params.post_id });
    } catch(err) {
        console.error(err);
        res.status(500).send('Comment_post Error') 
    }
});


app.get('/Add_User' , async(req,res) => {
    try {
        res.render('AddUser')
    } catch(err) {
        console.error(err);
        res.status(500).send('Error at Add_User')
    }
})

app.get('/Profile' , async(req,res) => {
    try {
        const respones_user = await axios.get(`${base_url}/users`) 
        const respones_post = await axios.get(`${base_url}/posts`) 
        res.render('Profile', {nameuser : username , post : respones_post.data , user : respones_user.data,id: id_user})
    }catch(err) {
        console.error(err);
        res.status(500).send('Error at Delete_user')
    }
})

app.get('/Delete_User/:id' , async(req,res) => {
   
       await axios.delete(base_url+'/user_Delete/' + req.params.id)
       const alert = "<script>window.location='/' ; alert('Delete account already.')</script>";
        res.send(alert);
})

app.get('/Delete_Post/:id' , async(req,res) => {
    await axios.delete(base_url+'/post_Delete/' + req.params.id)
    const alert = "<script>window.location='/Profile' ; alert('Delete Post already.')</script>";
        res.send(alert);
})


Login()
post()


app.listen(5500, () => {
    //console.log('Server started on port 5500');
});