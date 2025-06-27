import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Customer extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public pincode!: string;
  public aadharNumber!: string;
  public panNumber!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    indexes: [
      {
        unique: true,
        fields: ['aadharNumber'],
      },
      {
        unique: true,
        fields: ['panNumber'],
      },
      {
        unique: true,
        fields: ['phone'],
      },
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

export default Customer; 