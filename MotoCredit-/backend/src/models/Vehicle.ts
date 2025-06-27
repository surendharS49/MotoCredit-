import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';

class Vehicle extends Model {
  public id!: number;
  public customerId!: number;
  public registrationNumber!: string;
  public make!: string;
  public model!: string;
  public year!: number;
  public color!: string;
  public engineNumber!: string;
  public chassisNumber!: string;
  public rcStatus!: 'active' | 'expired' | 'suspended';
  public rcExpiryDate!: Date;
  public insuranceStatus!: 'active' | 'expired' | 'none';
  public insuranceExpiryDate!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: 'id',
      },
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    engineNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    chassisNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rcStatus: {
      type: DataTypes.ENUM('active', 'expired', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    rcExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    insuranceStatus: {
      type: DataTypes.ENUM('active', 'expired', 'none'),
      allowNull: false,
      defaultValue: 'none',
    },
    insuranceExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'vehicles',
    indexes: [
      {
        unique: true,
        fields: ['registrationNumber'],
      },
      {
        unique: true,
        fields: ['engineNumber'],
      },
      {
        unique: true,
        fields: ['chassisNumber'],
      },
    ],
  }
);

// Define associations
Vehicle.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

export default Vehicle; 