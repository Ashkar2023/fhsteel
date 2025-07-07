const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      retailPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        default : 0
      },
      wholeSalePrice: {
        type: DataTypes.FLOAT,
        allowNull: true, 
        defaultValue: null,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stock: {
        type: DataTypes.FLOAT,  
        allowNull: false,
        defaultValue: 0,
      },
      unitType: {
        type: DataTypes.ENUM('pcs', 'kg'), 
        allowNull: false,
        defaultValue: 'pcs',
      },

      lowStockThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      active:{
        type: DataTypes.BOOLEAN,
        defaultValue:true
      },
      isDeleted : {
        type: DataTypes.BOOLEAN,
        defaultValue:false
      }
    });
  
    Product.associate = (models) => {
      Product.belongsTo(models.Supplier, { foreignKey: 'supplierId', as: 'supplier' })
      Product.hasMany(models.Inventory, { foreignKey: 'productId' });
      Product.hasMany(models.Sale, { foreignKey: 'productId' });
    };
  
    return Product;
  };