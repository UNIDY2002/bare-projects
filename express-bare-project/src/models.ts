import { Sequelize, DataTypes, Model } from "sequelize";
import session from "express-session";

const MySQLStore = require("express-mysql-session")(session);

const DB_HOST = process.env.DB_HOST;
if (DB_HOST === undefined) process.exit(1);

const DB_PORT = process.env.DB_PORT;
if (DB_PORT === undefined) process.exit(1);

const DB_PORT_NUM = Number(DB_PORT);
if (isNaN(DB_PORT_NUM)) process.exit(1);

const DB_USERNAME = process.env.DB_USERNAME;
if (DB_USERNAME === undefined) process.exit(1);

const DB_PASSWORD = process.env.DB_PASSWORD;
if (DB_PASSWORD === undefined) process.exit(1);

export const sessionStore = new MySQLStore({
    host: DB_HOST,
    port: DB_PORT_NUM,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: "api",
});

const sequelize = new Sequelize("api", DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT_NUM,
    dialect: "mysql",
    define: {
        timestamps: false,
    }
});

export class User extends Model {
    declare username: string;
    declare password: string;
    declare admin: boolean;
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    tableName: "user",
});
