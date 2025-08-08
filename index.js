const express = require("express");
const fs = require('fs');
let users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

//middleware - plugin
app.use(express.urlencoded({extended : false}));

//Routes
// List all users
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.get("/api/users", (req, res) => {
    return res.json(users);
});

//get user with id
app
    .route("/api/users/:id")
    .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
    })
    .patch((req,res) => {
        const id = Number(req.params.id);
        const {first_name, last_name, email, gender, job_title} = req.body;
        const userToUpdate = users.find(user => user.id === id);
        if(userToUpdate) {
            if(first_name) userToUpdate.first_name = first_name;
            if(last_name) userToUpdate.last_name = last_name;
            if(email) userToUpdate.email = email;
            if(gender) userToUpdate.gender = gender;
            if(job_title) userToUpdate.job_title = job_title;
            res.send(`user with id ${id} has been updated`);
        } else {
            return res.json({status: "Pending"});
        }
    })
    .delete((req,res) => {
        const id = Number(req.params.id);
        const initialLength = users.length;
        users = users.filter(user => user.id !== id);
        if(users.length < initialLength){
            res.status(200).json({message: `user with id ${id} deleted successfully`});
        } else {
            res.send(`user not found`);
        }
    });


// //create new user
app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status: "success", id: users.length});
    });
});

// //edit the user with id
// app.patch('/api/users/:id', (req, res) => {
//     //TODO: edit the user with id
//     return res.json({status: "pending"});
// });

// //delete the user with id
// app.delete('/api/users/:id', (req, res) => {
//     //TODO: delete the user with id
//     return res.json({status: "pending"});
// });

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));