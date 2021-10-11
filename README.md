# jwt-login-sample

Example of registration and login using jwt token in **Nodejs**.

**MongoDB** is used as the database to store Users

In it, the users `/register` are registered and access is granted or not to the users `/login`

Once authorized (correct email and password), you access the protected page `/welcome`.

## Libraries used

`jsonwebtoken` to generate and verify **token**.

`bcryptjs` to hash user password.

##

![login](https://user-images.githubusercontent.com/69098117/136807793-d9bb6dbd-952f-40f1-b688-583f88c5eb2f.png)




