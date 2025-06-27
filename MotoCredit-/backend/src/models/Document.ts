import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import Vehicle from './Vehicle';
import Loan from './Loan';

class Document extends Model {
  public id!: number;
  public customerId?: number;
  public vehicleId?: number;
  public loanId?: number;
  public type!: 'aadhar' | 'pan' | 'rc' | 'insurance' | 'loan_agreement' | 'other';
  public name!: string;
  public path!: string;
  public mimeType!: string;
  public size!: number;
  public uploadedBy!: number; // User ID
  public status!: 'active' | 'archived' | 'deleted';
  public expiryDate?: Date;
  public remarks?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Customer,
        key: 'id',
      },
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Vehicle,
        key: 'id',
      },
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Loan,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('aadhar', 'pan', 'rc', 'insurance', 'loan_agreement', 'other'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'deleted'),
      allowNull: false,
      defaultValue: 'active',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'documents',
    indexes: [
      {
        fields: ['customerId'],
      },
      {
        fields: ['vehicleId'],
      },
      {
        fields: ['loanId'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Document.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Document.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

Document.belongsTo(Loan, {
  foreignKey: 'loanId',
  as: 'loan',
});

export default Document; 