module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("blog", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Blog;
};
