const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/sequelize_practice', { logging: false });

const User = db.define('user', {
  first: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  last: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 18
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bio: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
}, {
  getterMethods: {
    fullName: function(){
      return `${this.first} ${this.last}`;
    }
  },
  // couldn't get instance method to save new age
  instanceMethods: { //this refers to the instance
    haveBirthday: function(){
      return User.findAll({
        where: {
          age: this.age
        },
      })
      .then( (foundUser) => {
        var value = foundUser[0].dataValues.age;
        return this.age += 1;
      })
   }
  },
  hooks: {
    beforeValidate: function(user) {
      if (user.haveBirthday()) {
        user.age += 1;
      }
    }
  }
});

module.exports = User;
