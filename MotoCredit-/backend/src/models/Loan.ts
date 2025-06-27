import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import Vehicle from './Vehicle';

class Loan extends Model {
  public id!: number;
  public customerId!: number;
  public vehicleId!: number;
  public principalAmount!: number;
  public interestRate!: number;
  public tenure!: number; // in months
  public startDate!: Date;
  public endDate!: Date;
  public emiAmount!: number;
  public totalAmount!: number;
  public status!: 'active' | 'closed' | 'defaulted';
  public processingFee!: number;
  public disbursementDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Loan.init(
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
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicle,
        key: 'id',
      },
    },
    principalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    tenure: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    emiAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'defaulted'),
      allowNull: false,
      defaultValue: 'active',
    },
    processingFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    disbursementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'loans',
    indexes: [
      {
        fields: ['customerId'],
      },
      {
        fields: ['vehicleId'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Loan.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Loan.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

export default Loan; 