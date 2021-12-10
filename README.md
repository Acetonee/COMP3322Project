# COMP3322 Project

By [Acetonee](https://github.com/Acetonee)

NOT FOR REAL LIFE APPLICATIONS  
Passwords are stored as plain strings  
_Little Bobby Tables won't be happy_

---

### Development environment

| Application | Version |
| :-------: | :-----: |
| Node | 14.15.3 |
| Express | 4.17.1 |
| Mongoose | 6.0.14 |
| Pug | 3.0.2 |
| MongoDB | 5.0.4 |
| Mongoose | 6.0.14 |

---

## 1. Starting the Database

I am using a cloud-hosted database by Atlas in this project. Database setup should not be needed. But in case the database fails. One can change the `Mongoose.connect()` function's `url` to point to an empty new Mongo database. Since Mongo just creates a new collection if it doesn't exist anyway.

---

## 2. Starting the Web Server

1. Navigate to the root directory of this repository
2. Run the command `node .`
3. Pray to god it works. I need my GPA

---

## 3. Accessing the Main Page of the Web Application

By default, the node server should start at `localhost:3000`. Do check if your node is configured to start at another port

---

Should have completed all requirements.