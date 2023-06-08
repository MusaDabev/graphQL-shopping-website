import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = (await User.findById(id)).populate("cart");
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user");
      }
    },
    getUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch users");
      }
    },
    getProduct: async (_, { id }) => {
      try {
        const product = await Product.findById(id);
        return product;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch product");
      }
    },
    getProducts: async () => {
      try {
        const products = await Product.find();
        return products;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch products");
      }
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      {
        title,
        description,
        price,
        image,
        quantity,
      }: {
        title: string;
        description: string;
        price: number;
        image: string;
        quantity: number;
      }
    ) => {
      try {
        const product = new Product({
          title,
          description,
          price,
          image,
          quantity,
        });
        await product.save();
        return product;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create product");
      }
    },
    createUser: async (
      _: any,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({ name, email, password: hashedPassword }); // Save the hashed password
        await user.save();
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create user");
      }
    },
    addToCart: async (_, { userId, productId }) => {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user || !product) {
        throw new Error("User or product not found");
      }

      user.cart.push(product);
      await user.save();

      return user;
    },
    deleteProduct: async (_, { id }) => {
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          throw new Error("Product not found");
        }
        return true;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete product");
      }
    },
    updateProduct: async (
      _,
      { id, title, description, price, image, quantity }
    ) => {
      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            title,
            description,
            price,
            image,
            quantity,
          },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error("Product not found");
        }

        return updatedProduct;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update product");
      }
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }

      return {
        user,
      };
    },
    removeFromCart: async (_, { userId, itemId }) => {
      try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        // Remove the item from the user's cart
        user.cart = user.cart.filter((item) => {
          return item._id.toString() !== itemId;
        });

        // Save the updated user
        await user.save();

        return true;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to remove item from cart");
      }
    },
  },
};
