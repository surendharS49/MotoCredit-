import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Loan from './Loan';

class EMI extends Model {
  public id!: number;
  public loanId!: number;
  public dueDate!: Date;
  public amount!: number;
  public status!: 'pending' | 'paid' | 'overdue';
  public paidAmount!: number;
  public paidDate!: Date | null;
  public lateFee!: number;
  public paymentMethod?: 'cash' | 'bank_transfer' | 'cheque' | 'upi';
  public transactionId?: string;
  public remarks?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EMI.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Loan,
        key: 'id',
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'overdue'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lateFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'cheque', 'upi'),
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'emis',
    indexes: [
      {
        fields: ['loanId'],
      },
      {
        fields: ['dueDate'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
EMI.belongsTo(Loan, {
  foreignKey: 'loanId',
  as: 'loan',
});

export default EMI; 